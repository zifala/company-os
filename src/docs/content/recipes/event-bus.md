# Event bus

Rule: the activity row is the event; automations and webhooks listen to `Activity::created`, never to controllers or model events.

Shape:
- `app/Models/Activity.php` `booted()` — two listeners: `AutomationTriggers::fromActivity`, `WebhookFanOut::fromActivity`.
- `app/Enums/AutomationTrigger.php` — `fromEvent(string): ?self` maps `<model>.<verb_past>` to a trigger.
- `app/Support/AutomationTriggers.php` — match enabled automations, dispatch `FireAutomation` per match.
- `app/Jobs/FireAutomation.php` — queued, `afterCommit()`, 3 tries, `deleteWhenMissingModels`.
- `app/Actions/Automation/RunAutomation.php` — once-per-trigger ledger, runs the effect through normal Actions as the automation's creator.
- `automation_runs`: `automation_id`, `subject_type`, `subject_id`, `trigger_key`, `status`, `error`. Unique on (`automation_id`, `subject_id`, `trigger_key`).
- `app/Support/Webhooks/WebhookEvents.php` — public catalogue of event names, grouped for the UI.
- `app/Support/Webhooks/WebhookFanOut.php` — one `webhook_deliveries` row per subscribed endpoint, after commit.
- `app/Jobs/DeliverWebhook.php` — signed POST, retry schedule, auto-disable after N days failing.

Code:

```php
protected static function booted(): void
{
    static::created(fn (Activity $activity) => app(AutomationTriggers::class)->fromActivity($activity));
    static::created(fn (Activity $activity) => WebhookFanOut::fromActivity($activity));
}
```

```php
public function fromActivity(Activity $activity): void
{
    $trigger = AutomationTrigger::fromEvent((string) $activity->event);

    if ($trigger === null || (Context::getHidden(ActivityChannel::ContextKey)['via'] ?? null) === ActivityChannel::Automation->value) {
        return;
    }

    foreach ($this->matching($trigger, $activity->subject) as $automation) {
        FireAutomation::dispatch($automation, $activity->subject, 'activity:'.$activity->id);
    }
}
```

```php
$run = AutomationRun::query()->createOrFirst(
    ['automation_id' => $automation->id, 'subject_id' => $subject->getKey(), 'trigger_key' => $triggerKey],
    ['subject_type' => $subject->getMorphClass(), 'status' => AutomationRunStatus::Running],
);

if (! $run->wasRecentlyCreated) {
    return null;
}

ActivityChannel::during(ActivityChannel::Automation, $automation->name, fn () => $this->effects->apply($automation, $subject, $automation->creator));
```

```php
public static function fromActivity(Activity $activity): void
{
    $event = (string) $activity->event;

    if (! WebhookEvents::has($event)) {
        return;
    }

    $endpoints = WebhookEndpoint::query()->where('active', true)->whereJsonContains('events', $event)->get(['id']);

    if ($endpoints->isNotEmpty()) {
        DB::afterCommit(fn () => self::queue($event, WebhookPayload::fromActivity($activity), $endpoints));
    }
}
```

- Payload: `{id, type, occurred_at, actor: {id, email} | null, data}`. `data` = the same row shape the public API returns for that resource.
- Signature header: `t=<unix>,v1=` + `hash_hmac('sha256', "<t>.<body>", $secret)`. Event and delivery id in their own headers.
- Scheduled triggers (due date passed) use a date trigger key `due:<Y-m-d>` and the same ledger.
- Catch per effect: `ValidationException`, `AuthorizationException`, `ModelNotFoundException` → run `failed` + message; anything else → `report()` + `failed`. Never roll back the triggering change.

Test:
- Logging the event queues `FireAutomation` after commit, not inline.
- Same trigger twice → one run row, one effect.
- Effect logged inside a run carries `via: automation` and fires no further automation.
- Paused automation → no run row. Deactivated creator → run `failed`, nothing done.
- Committed change → one signed delivery per subscribed endpoint; rolled-back change → none.
- Unsubscribed event or inactive endpoint → nothing. Retry on backoff; last attempt gives up; N days failing disables the endpoint and notifies its creator.
- Private / loopback webhook URL blocked in production.

Gotchas:
- Hidden `Context` flag is the loop breaker. Without it, automation A's effect triggers B, B triggers A.
- Dispatch with `afterCommit()` / `DB::afterCommit`; a rollback must not leak events.
- Webhook URL: resolve DNS once, reject private ranges, pin the IP (`CURLOPT_RESOLVE`), `withoutRedirecting()`, short timeout. Checked at save and at send.
- `DeliverWebhook` `tries = 1`; it re-dispatches itself with its own delay so attempts and next time live on the delivery row.
- Only events in the catalogue leave the system. Internal events stay internal.
- The bus only sees what Actions log. A write without an activity row is invisible to automations and webhooks.
- Trigger labels and catalogue group names come from lang.

Harvested: 2026-10-08
