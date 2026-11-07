# Webhooks

Rule: an endpoint subscribes to catalogue events; every delivery is a row, signed, sent to a pinned public IP, retried on backoff, and the endpoint turns itself off after days of failure.

Shape:
- Fan-out, payload shape, signature header format, catalogue → `event-bus.md`. This recipe owns endpoints, delivery, retry, SSRF, UI.
- `webhook_endpoints`: uuid `id`, `url` (2048), `secret` text (`encrypted` cast, `$hidden`), `events` json, `active` bool, `failing_since`, `disabled_at`, `created_by`, timestamps.
- `webhook_deliveries`: uuid `id`, `webhook_endpoint_id` cascade, `event`, `payload` json, `status`, `attempts`, `response_code`, `response_excerpt` (500), `next_attempt_at`, `delivered_at`, timestamps. Index (`webhook_endpoint_id`, `created_at`).
- `app/Enums/WebhookDeliveryStatus.php` — `Pending`, `Retrying`, `Delivered`, `Failed`; `label()` from lang, `tone()`.
- `app/Support/Webhooks/WebhookUrl.php` — `pin(url): ?list<string>`; `null` = blocked.
- `app/Support/Webhooks/DnsResolver.php` — one method `addresses(host)`; mocked in tests.
- `app/Rules/PublicWebhookUrl.php` — same check at save.
- `app/Jobs/DeliverWebhook.php` — `tries = 1`, re-dispatches itself with its own delay.
- `app/Actions/Webhook/` — `CreateWebhookEndpoint`, `RotateWebhookSecret`, `DisableWebhookEndpoint`, `EnableWebhookEndpoint`, `SendTestWebhook`, `ResendWebhookDelivery`, `SendWebhookDelivery`.
- Routes under `organization.integrations.webhooks.*`, permission `integrations.manage`. Create and rotate behind `password.confirm`. Disable is `ReasonRequest`.
- Pages: endpoint list + create modal; endpoint page with delivery log (25 per page), resend per row.

Code:

```php
public const int MaxAttempts = 8;
public const array RetryDelaysSeconds = [60, 300, 1800, 7200, 21600, 43200, 86400];
public const int DisableAfterFailingDays = 3;

public function retryDelay(): ?int
{
    return $this->attempts >= self::MaxAttempts ? null : self::RetryDelaysSeconds[$this->attempts - 1] ?? null;
}

public function failedTooLong(): bool
{
    return $this->failing_since?->lessThanOrEqualTo(now()->subDays(self::DisableAfterFailingDays)) ?? false;
}
```

```php
public static function pin(string $url): ?array
{
    if (app()->environment(['local', 'testing'])) {
        return [];
    }

    $host = trim((string) parse_url($url, PHP_URL_HOST), '[]');

    if ($host === '' || in_array(strtolower($host), ['localhost', 'localhost.localdomain'], true)) {
        return null;
    }

    if (filter_var($host, FILTER_VALIDATE_IP) !== false) {
        return self::isPublicAddress($host) ? [] : null;
    }

    $addresses = app(DnsResolver::class)->addresses($host);

    if ($addresses === [] || ! collect($addresses)->every(self::isPublicAddress(...))) {
        return null;
    }

    $port = parse_url($url, PHP_URL_PORT) ?? (parse_url($url, PHP_URL_SCHEME) === 'http' ? 80 : 443);
    $address = str_contains($addresses[0], ':') ? "[{$addresses[0]}]" : $addresses[0];

    return ["{$host}:{$port}:{$address}"];
}

private const array NonPublicRanges = ['100.64.0.0/10', '192.0.0.0/24', '192.0.2.0/24', '198.18.0.0/15', '198.51.100.0/24', '203.0.113.0/24', '224.0.0.0/4', '64:ff9b::/96', '2001:db8::/32', 'ff00::/8'];

private static function isPublicAddress(string $address): bool
{
    return filter_var($address, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false
        && ! IpUtils::checkIp($address, self::NonPublicRanges);
}
```

```php
public function handle(DisableWebhookEndpoint $disable): void
{
    $delivery = $this->delivery->refresh();
    $endpoint = $delivery->endpoint;

    if (! $endpoint->active || $delivery->status === WebhookDeliveryStatus::Delivered) {
        return;
    }

    [$code, $excerpt] = $this->send($delivery);
    $delivery->attempts++;
    $delivery->fill(['response_code' => $code, 'response_excerpt' => Str::limit($excerpt, 490), 'next_attempt_at' => null]);

    if ($code !== null && $code >= 200 && $code < 300) {
        $delivery->fill(['status' => WebhookDeliveryStatus::Delivered, 'delivered_at' => now()])->save();
        $endpoint->update(['failing_since' => null]);

        return;
    }

    $endpoint->update(['failing_since' => $endpoint->failing_since ?? now()]);
    $delay = $endpoint->failedTooLong() ? null : $delivery->retryDelay();
    $delivery->fill([
        'status' => $delay === null ? WebhookDeliveryStatus::Failed : WebhookDeliveryStatus::Retrying,
        'next_attempt_at' => $delay === null ? null : now()->addSeconds($delay),
    ])->save();

    match (true) {
        $endpoint->failedTooLong() => $disable->handle($endpoint, null, __('webhooks.disabled_after_failing', ['days' => WebhookEndpoint::DisableAfterFailingDays])),
        $delay !== null => self::dispatch($delivery)->delay($delay),
        default => null,
    };
}
```

```php
$response = Http::timeout(self::TimeoutSeconds)->withoutRedirecting()
    ->withOptions($pin === [] ? [] : ['curl' => [CURLOPT_RESOLVE => $pin]])
    ->withHeaders([
        'User-Agent' => Str::slug(config('app.name')).'-webhooks/1',
        'X-Webhook-Event' => $delivery->event,
        'X-Webhook-Delivery' => $delivery->id,
        'X-Webhook-Signature' => WebhookPayload::signature($endpoint->secret, $body, now()->getTimestamp()),
    ])
    ->withBody($body, 'application/json')->post($endpoint->url);
```

- Secret: `'whsec_'.Str::random(40)`. Shown once: Action returns it, controller flashes it, page shows it in a copy box. Never in props after that.
- `DisableWebhookEndpoint(endpoint, ?actor, reason)`: `actor` null = system. System disable notifies the creator (if active) with a link to the endpoint page. Audit `webhook_endpoint.disabled` + reason.
- Enable clears `disabled_at` and `failing_since`. Test send uses event `webhook.test`. Resend copies payload into a new delivery row.
- Audit: `webhook_endpoint.created|enabled|disabled|secret_rotated|test_sent`, `webhook_delivery.resent`. URL and events in properties; never the secret.
- Store request: `url` required, `url:https`, max 2048, `PublicWebhookUrl`; `events` array min 1, each `Rule::in(WebhookEvents::all())`.

Test:
- Page and every action 403 without `integrations.manage`; create and rotate demand recent password.
- Create shows the secret once; reload hides it.
- `http://` URL and unknown event → 422.
- 2xx → `Delivered`, `failing_since` cleared. Non-2xx → `Retrying`, next attempt from schedule, job re-queued with that delay.
- Eighth failure → `Failed`, no re-queue.
- `failing_since` older than 3 days → endpoint off, creator notified, `webhook_endpoint.disabled` with reason.
- Signature verifies: `hash_hmac('sha256', "<t>.<body>", secret)` equals `v1`.
- Pin (mock `DnsResolver`): connection pinned to the checked IP; a second DNS answer is never dialled.
- Any private answer among several → blocked, nothing sent, excerpt says blocked. Dataset: `100.64.0.1`, `198.18.0.1`, `224.0.0.1`, `2001:db8::1`, `169.254.169.254`.
- IPv6 answer pinned in brackets on the URL port.
- Production only: `app()['env'] = 'production'` in the test.

Gotchas:
- Check at save and again at send. DNS can rebind between them; the pin closes that gap.
- `withoutRedirecting()` always. A redirect to `169.254.169.254` bypasses the pin.
- Product name never hardcoded in headers or test payloads: `config('app.name')`. Header names are generic so customers' verifiers survive a rename.
- Status labels, flash toasts, guard messages, rule message → `__()`. Never English literals in Actions, enums, or row builders.
- Delivery rows grow fast. Prune delivered rows older than 30 days with `Prunable`.
- Validate in a Form Request, not `$request->validate()` in the controller.

Harvested: 2026-10-08 (endpoints, delivery, retry, pin, auto-disable from source; lang labels, generic headers, Form Request, pruning from standard)
