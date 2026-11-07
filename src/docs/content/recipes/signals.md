# Signals

Rule: scheduled jobs check rules in each user's local time and send through the normal notification pipe; a sent-ledger makes every reminder once per item per day, so jobs are safe to re-run; rule signals are plain queries that raise a deduplicated insight row.

Shape:
- `sent_reminders` table: `user_id`, `event`, `subject_id`, `sent_on` (local date), `created_at`. Primary key on the first four.
- `app/Support/DueReminders.php` — `for(User, CarbonImmutable $now): Collection<ReminderNotification>`. Rules by local hour.
- `app/Jobs/SendDueReminders.php` — hourly. Per active user: rules → ledger insert → notify.
- `app/Jobs/SendMorningBrief.php` — hourly; dispatches `SendUserMorningBrief` for users whose local hour is 07–11 and not yet in the ledger.
- `app/Support/Home/HomeBrief.php` — `measured(User)`: counts with links ("3 overdue, 2 due today"). Brief skipped when empty.
- `reminders` table + `app/Actions/Reminder/{Set,Update,Complete,Delete}Reminder.php` — personal reminders, owner only. `SendReminders` job every minute.
- `app/Support/Signals/Signal.php` — readonly value: `kind`, `scope` model, `severity`, `title`, `body`, `evidence` lines.
- `app/Support/Signals/<Area>Signals.php` — static rule methods returning `list<Signal>` (slipping, stale, overloaded, overdue, idle).
- Signals hand `Signal` values to `RecordInsight`. Inbox, dedupe, dismiss, apply → `insights.md`.
- `NotificationEvent` reminder cases: `<model>_due_soon`, `<model>_overdue`, `reminder_due`, `morning_brief`, `insight_raised`. `isReminder()` true.

Code:

```php
public function handle(): void
{
    $now = CarbonImmutable::now();

    User::query()->active()->with('notificationPreferences')->lazyById()
        ->each(function (User $user) use ($now): void {
            $sentOn = $now->setTimezone($user->timezone)->toDateString();

            DueReminders::for($user, $now)
                ->filter(fn (ReminderNotification $reminder): bool => DB::table('sent_reminders')->insertOrIgnore([
                    'user_id' => $user->id,
                    'event' => $reminder->event->value,
                    'subject_id' => $reminder->subjectId(),
                    'sent_on' => $sentOn,
                ]) === 1)
                ->each(fn (ReminderNotification $reminder) => $user->notify($reminder));
        });
}
```

```php
public static function for(User $user, CarbonImmutable $now): Collection
{
    $local = $now->setTimezone($user->timezone);
    $today = $local->startOfDay();
    $reminders = collect();

    if ($local->hour >= self::MorningHour) {
        $reminders = $reminders->merge(self::owned($user)->whereDate('due_on', '<', $today)->get()
            ->map(fn (<Model> $record) => self::reminder($record, NotificationEvent::<Model>Overdue)));
    }

    if ($local->hour >= self::EveningHour) {
        $reminders = $reminders->merge(self::owned($user)->whereDate('due_on', $today->addDay())->get()
            ->map(fn (<Model> $record) => self::reminder($record, NotificationEvent::<Model>DueSoon)));
    }

    return $reminders->values();
}
```

```php
Reminder::query()->open()->whereNull('sent_at')->where('remind_at', '<=', $now)->lazyById()
    ->each(function (Reminder $reminder) use ($now): void {
        if (Reminder::query()->whereKey($reminder->id)->whereNull('sent_at')->update(['sent_at' => $now]) !== 1) {
            return;
        }

        $reminder->user->notify(new ReminderNotification(NotificationEvent::ReminderDue, $reminder->id, $reminder->title, $reminder->url()));
    });
```

```php
final readonly class Signal
{
    /**
     * @param list<array{text: string, records: list<Model>}> $evidence
     * @param list<array{type: string, payload: array<string, mixed>, applied_at: ?string}> $suggestions
     */
    public function __construct(
        public InsightKind $kind,
        public ?Model $scope,
        public InsightSeverity $severity,
        public string $title,
        public string $body,
        public array $evidence,
        public array $suggestions = [],
    ) {}
}
```

- Signals run with or without AI. An AI agent may rewrite the text; the rule decides whether it fires.
- `routes/console.php`: `Schedule::job(new SendDueReminders)->hourly()->withoutOverlapping()->onOneServer();` Same for brief (hourly), reminders (every minute), signals (daily).
- Brief job is `ShouldBeUnique` on `user:date`; ledger insert happens only after the brief text exists.

Test:
- Morning run lists overdue items in the user's timezone; evening run adds due-tomorrow.
- Job run twice the same day → one notification; next day → sent again if still overdue.
- Deactivated users get nothing. Done / canceled / trashed records never reminded.
- Users without view permission get no reminder for that record.
- Reminder claimed twice → one `reminder_due`. Updating `remind_at` clears `sent_at` and it fires again.
- Reminders follow the matrix; email delayed in quiet hours, in-app not.
- Brief goes once from 07:00 local, not at 06:00; hourly run queues one job per due user; empty brief and deactivated users get none.
- Personal reminder: another user cannot update, complete or delete it (404); completed reminder never fires.
- A healthy scope raises no signal; a rule just over its threshold does (e.g. load above pace, slip > 0 days).
Gotchas:
- Job runs in app timezone; every "today" is the user's (`UserTime`). Never `today()` inside a per-user rule.
- `withoutOverlapping` stops double dispatch, not double sends. The ledger's primary key does that: insert first, send only when inserted.
- Missed hour catches up on the next run because rules use `>=` on the hour, not `==`.
- Ledger `subject_id` type must match your keys (uuid vs bigint).
- Reminder text, mail subject and brief copy go through `__()`. Never build English sentences in PHP.
- Signal thresholds live as named constants on the rule class (`StaleDays`, `CriticalDaysLate`) and in `docs/business-logic/<domain>.md`.

Harvested: 2026-10-08 (all from source; reminder ownership test from standard)
