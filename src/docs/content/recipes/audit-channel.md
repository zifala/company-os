# Audit channel

Rule: every activity row says how the change arrived — `via` web, api, automation, or agent — stamped in one place before save, never by the Action.

Shape:
- Event names, reasons, audit page, CSV → `audit.md`. This recipe owns only the stamp.
- `app/Enums/ActivityChannel.php` — `Web`, `Api`, `Automation`, `Agent`; `label()` from lang; `ContextKey`; `current()`; `during()`.
- `AppServiceProvider::boot()` — one `LogActivityAction::beforeLogging()` callback (spatie/laravel-activitylog v5).
- Properties written: `via` (enum value) + `origin` (automation name, insight id, or token name; `null` for web).
- Sanctum token ability `agent` marks agent tokens (MCP, AI clients). Any other token → `api`.
- Activity timeline row and audit page show a muted "via automation “<origin>”" line; nothing for web.
- Audit page filter `via`; CSV column `via`.

Code:

```php
enum ActivityChannel: string
{
    case Web = 'web';
    case Api = 'api';
    case Automation = 'automation';
    case Agent = 'agent';

    public const string ContextKey = 'activity_channel';

    public function label(): string
    {
        return __("enums.activity_channel.{$this->value}");
    }

    /** @return array{via: string, origin: string|null} */
    public static function current(): array
    {
        if (Context::hasHidden(self::ContextKey)) {
            return Context::getHidden(self::ContextKey);
        }

        $token = auth()->user()?->currentAccessToken();

        return match (true) {
            $token instanceof PersonalAccessToken => ['via' => ($token->can('agent') ? self::Agent : self::Api)->value, 'origin' => $token->name],
            request()->route() === null => ['via' => self::Automation->value, 'origin' => null],
            default => ['via' => self::Web->value, 'origin' => null],
        };
    }

    public static function during(self $channel, string $origin, Closure $callback): mixed
    {
        $previous = Context::getHidden(self::ContextKey);
        Context::addHidden(self::ContextKey, ['via' => $channel->value, 'origin' => $origin]);

        try {
            return $callback();
        } finally {
            $previous === null ? Context::forgetHidden(self::ContextKey) : Context::addHidden(self::ContextKey, $previous);
        }
    }
}
```

```php
LogActivityAction::beforeLogging(function (Model $activity): void {
    $properties = $activity->getAttribute('properties');
    $base = $properties instanceof Collection ? $properties : new Collection;

    $activity->setAttribute('properties', $base->merge(ActivityChannel::current()));
});
```

```php
ActivityChannel::during(ActivityChannel::Automation, $automation->name, fn () => $this->effects->apply($automation, $subject, $automation->creator));
```

```php
ActivityChannel::during(ActivityChannel::Agent, $insight->id, fn () => $this->apply($suggestion, $actor));
```

- Automation runner, insight `ApplySuggestion`, scheduled jobs that write through Actions → wrap the call in `during()`.
- `ApplySuggestion` is `agent` even though a person clicked: the change was proposed by the rule / agent; the causer is still the person.
- The loop breaker for automations reads the same key: `Context::getHidden(ActivityChannel::ContextKey)['via'] ?? null` is `automation` → skip triggers.
- Activity resource: `'via' => $via === ActivityChannel::Web ? null : __('audit.via', ['channel' => $via->label(), 'origin' => $origin])`.

Test:
- Request through the web UI → `properties.via` = `web`, `origin` null.
- Same Action through a Sanctum API token → `api`, origin = token name.
- Token with ability `agent` → `agent`.
- Effect run inside an automation → `automation`, origin = automation name; triggering row keeps its own channel.
- Applied insight suggestion → target Action's row `agent` + insight id; `insight.suggestion_applied` itself is `web` (the click).
- Nested `during()` restores the outer channel after the inner block.
- Action's own properties (reason, changes) survive the merge.
- Audit filter `via=automation` lists only automation rows; CSV has the column.

Gotchas:
- `via` is reserved. Actions never write `via` for their own meaning (`moved`, `handover`, `invitation`). Use `cause` for that. The stamp would overwrite it, or it would fake a channel.
- Stamp in `beforeLogging`, not in `Activity::creating`. The callback runs for every `activity()->log()` and sees properties already set.
- `runningInConsole()` is true inside HTTP tests; decide web vs automation by `request()->route()`, not by console.
- Sanctum session requests return a `TransientToken`, not `PersonalAccessToken`; the `instanceof` keeps them `web`.
- Hidden `Context` travels into jobs dispatched inside `during()`; a job an automation queued stays `automation`. Scheduled jobs dispatched outside it call `during()` themselves.
- Channel labels come from lang. Never print the raw enum value to users.

Harvested: 2026-10-08 (beforeLogging stamp, context keys for automation and agent from source; web and api channels, one enum, `cause` rename from standard)
