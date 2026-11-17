# Settings

Rule: workspace config is one singleton row changed only by Actions; each user owns their timezone and quiet hours; secrets stay in env and the UI only says ok / missing with the env names to set.

Shape:
- `workspace_settings` table, one row: typed columns per setting (`require_two_factor` bool, `setup_finished_at`, …). No key/value bag.
- `app/Models/WorkspaceSetting.php` — `current()` returns the row or an unsaved default.
- `app/Actions/Workspace/Set<Setting>.php` — one Action per setting change. Gate `settings.manage`, password confirm on security settings.
- `users`: `timezone` (required, default app timezone), `quiet_hours_start`, `quiet_hours_end` (`H:i`, nullable together). Edited on the personal profile page.
- `app/Support/UserTime.php` — every "today" and every local ↔ UTC conversion.
- `app/Support/ServiceStatus.php` — rows `{key, label, ok, env}` from `config()`. Shown on the workspace page and the setup checklist.
- Pages: personal `Settings/profile`; platform `Organization/workspace`.

Code:

```php
class WorkspaceSetting extends Model
{
    public static function current(): self
    {
        return self::query()->first() ?? new self(['require_two_factor' => false]);
    }
}
```

```php
final class SetTwoFactorRequirement
{
    public function handle(User $actor, bool $required): WorkspaceSetting
    {
        Gate::forUser($actor)->authorize('settings.manage');
        $setting = WorkspaceSetting::current();

        if ($setting->exists && $setting->require_two_factor === $required) {
            return $setting;
        }

        $old = $setting->require_two_factor;
        $setting->require_two_factor = $required;
        $setting->save();

        activity()->causedBy($actor)->event('workspace.two_factor_requirement_changed')
            ->withProperties(['old' => ['require_two_factor' => $old], 'new' => ['require_two_factor' => $required]])
            ->log('workspace.two_factor_requirement_changed');

        return $setting;
    }
}
```

```php
final class UserTime
{
    public static function today(User $user): CarbonImmutable
    {
        return CarbonImmutable::parse(CarbonImmutable::now($user->timezone)->toDateString());
    }

    public static function toUtc(string $local, User $user): CarbonImmutable
    {
        return CarbonImmutable::parse($local, $user->timezone)->utc();
    }

    public static function local(DateTimeInterface $at, User $user): CarbonImmutable
    {
        return CarbonImmutable::instance($at)->setTimezone($user->timezone);
    }
}
```

```php
public function quietHoursEnd(): ?CarbonImmutable
{
    if ($this->quiet_hours_start === null || $this->quiet_hours_end === null) {
        return null;
    }

    $now = CarbonImmutable::now($this->timezone);
    $start = $now->setTimeFromTimeString($this->quiet_hours_start);
    $end = $now->setTimeFromTimeString($this->quiet_hours_end);

    if ($start->lessThan($end)) {
        return $now->between($start, $end) ? $end : null;
    }

    return match (true) {
        $now->greaterThanOrEqualTo($start) => $end->addDay(),
        $now->lessThan($end) => $end,
        default => null,
    };
}
```

```php
final class ServiceStatus
{
    /** @return list<array{key: string, label: string, ok: bool, env: list<string>}> */
    public static function rows(): array
    {
        return [
            self::row('mail', ! in_array(config('mail.default'), ['log', 'array'], true), ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS']),
            self::row('queue', config('queue.default') !== 'sync', ['QUEUE_CONNECTION']),
        ];
    }

    /** @param list<string> $env */
    private static function row(string $key, bool $ok, array $env): array
    {
        return ['key' => $key, 'label' => __("services.{$key}"), 'ok' => $ok, 'env' => $env];
    }
}
```

- Profile rules: `'timezone' => ['required', 'timezone:all']`, `'quiet_hours_start' => ['nullable', 'date_format:H:i', 'required_with:quiet_hours_end']` and the mirror.
- Share `timezone` and quiet hours in `auth.user`; React formats nothing time-zone related itself.
- Notifications ask `quietHoursEnd()` and delay delivery to that moment.
- Every settings Action logs `workspace.<setting>_changed` with old / new. Same value → no write, no log.
- Secrets never stored in the settings row and never sent to React. If a secret must be set in the UI, store it `encrypted`, log only `key_changed`.

Test:
- Setting change needs `settings.manage` and a fresh password; logged with old and new.
- Saving the same value writes and logs nothing.
- `current()` works before any row exists.
- Every service reads missing on an empty config and ok once its keys are set; the page props carry env names, never config values.
- Record due yesterday in the user's timezone is overdue while the server date is still that day.
- Quiet hours across midnight (22:00–07:00) return the next-morning end; outside the window → null.
- Invalid timezone or half-set quiet hours rejected.

Gotchas:
- Never `now()->toDateString()` for user-facing "today". Use `UserTime::today()` or the viewer helper.
- Store UTC. Convert at the edges only.
- Freeze time in tests (`$this->travelTo`) when checking timezone and quiet-hours logic.
- `ServiceStatus` reads `config()`, never `env()` — config caching makes `env()` null in production.
- Platform settings live under `Organization/`, never under personal `Settings/`.

Harvested: 2026-10-08
