# Notifications

Rule: an Action notifies after commit; a resolver picks recipients, drops the actor, inactive users and anyone who lost access; each user's event × channel matrix picks channels; quiet hours delay email only; every in-app row lands in the bell and a history page.

Shape:
- `app/Enums/NotificationEvent.php` — one case per event (`<model>_assigned`, `<model>_commented`, `mentioned`, `<model>s_changed_in_bulk`, reminders). `label()` from lang, `isOptIn()`, `isEmailByDefault()`, `isReminder()`.
- `app/Enums/NotificationChannel.php` — `InApp`, `Email` (+ optional `Whatsapp` / SMS). `isOnByDefault()`: in-app only.
- `notification_preferences` table: `user_id`, `event`, `channel`, `enabled`. No row → default.
- `User::wantsNotification(NotificationEvent, NotificationChannel): bool`, `User::quietHoursEnd()` (see `settings`).
- `app/Notifications/ChannelNotification.php` — abstract base: `via()` from matrix, `withDelay()` from quiet hours, `toArray()` stores `event`, `subject_id`, `message`, `url`, `channels`.
- One subclass per message shape: `<Model>EventNotification`, `<Model>DigestNotification`, `ReminderNotification`.
- `app/Actions/<Model>/Notify<Model>Event.php` — recipients, filter, send, digest mode.
- `app/Actions/User/UpdateNotificationPreferences.php` — audit `user.notifications_updated`.
- `app/Support/NotificationHistory.php` — paginated own rows, filter by event + read state.
- `NotificationController`: `index` (JSON, last 30 for the bell), `history` (page), `open` (mark read → redirect to stored url), `read` (mark all).
- `components/notification-bell.tsx` — unread count from shared props, list loaded on open, live via Echo on `App.Models.User.{id}`.
- Pages: `Settings/notifications` (matrix), `notifications/history`.

Code:

```php
abstract class ChannelNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    abstract public function event(): NotificationEvent;
    abstract public function message(): string;
    abstract public function url(): string;
    abstract public function subjectId(): string;

    /** @return list<string> */
    public function via(User $notifiable): array
    {
        return [
            ...($notifiable->wantsNotification($this->event(), NotificationChannel::InApp) ? ['database', 'broadcast'] : []),
            ...($notifiable->wantsNotification($this->event(), NotificationChannel::Email) ? ['mail'] : []),
        ];
    }

    /** @return array<string, DateTimeInterface|null> */
    public function withDelay(User $notifiable): array
    {
        return ['mail' => $notifiable->quietHoursEnd()];
    }

    public function toBroadcast(User $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([...$this->toArray($notifiable), 'desktop' => $this->event()->isReminder()]);
    }
}
```

```php
public function wantsNotification(NotificationEvent $event, NotificationChannel $channel): bool
{
    $preference = $this->notificationPreferences
        ->first(fn (NotificationPreference $row): bool => $row->event === $event && $row->channel === $channel);

    return $preference->enabled ?? (! $event->isOptIn()
        && ($channel->isOnByDefault() || ($channel === NotificationChannel::Email && $event->isEmailByDefault())));
}
```

```php
public function send(Collection $users, <Model> $subject, User $actor, NotificationEvent $event, string $change): void
{
    $recipients = EloquentCollection::make($users->all())
        ->loadMissing('notificationPreferences')
        ->reject(fn (User $user): bool => $user->id === $actor->id || ! $user->isActive())
        ->filter(fn (User $user): bool => $user->can('view', $subject))
        ->unique('id')->values();

    if (self::$digest === null) {
        Notification::send($recipients, new <Model>EventNotification($event, $subject, $actor, $change));

        return;
    }

    foreach ($recipients as $user) {
        self::$digest[$user->id]['user'] = $user;
        self::$digest[$user->id]['refs'][$subject->id] = $subject->ref;
    }
}

public static function asDigest(User $actor, Closure $work): mixed
{
    self::$digest = [];

    try {
        $result = $work();
        $collected = self::$digest;
    } finally {
        self::$digest = null;
    }

    foreach ($collected as $entry) {
        $entry['user']->notify(new <Model>DigestNotification($actor, $entry['refs']));
    }

    return $result;
}
```

- Each notification constructor calls `$this->afterCommit()`. Also set `'after_commit' => true` on every connection in `config/queue.php`.
- Bulk Action wraps its loop: `Notify<Model>Event::asDigest($actor, fn () => …)`. One digest per recipient: "Ann changed 12 <model>s: A-1, … and 7 more" (first 5 refs).
- Opt-in event (`managed_<module>_activity`): no row → off on every channel. Only users not already notified get it.
- Mentions: `mentioned` replaces `<model>_commented` for that user. Longest handle wins; `mail@name` does not count; self-mention ignored.
- Matrix update: one transaction, `updateOrCreate` per event × channel, then `unsetRelation('notificationPreferences')`.
- Shared prop `unreadNotifications` (count) in `HandleInertiaRequests::share()`.
- Broadcast channel `App.Models.User.{id}` authorized in `routes/channels.php`: `$user->id === $id`.
- Desktop alert only when `desktop` is true, tab hidden and permission granted.

Test:
- Rolled-back transaction sends nothing; committed one sends (`Event::fake([NotificationSent::class])`).
- Comment notifies assignee, creator, earlier commenters; not the actor, not an opted-out manager.
- Deactivated users and users who lost view access get nothing.
- No saved rows → in-app on, email only for the email-by-default events; a saved row beats the default.
- Quiet hours 22:00–07:00 at 23:00 local → `quietHoursEnd()` is 07:00 next day; outside → null.
- Bulk edit of N records → one digest per recipient, none on error.
- Save that changes nothing notifies nobody.
- Opening another user's notification id → 404; opening own marks read and redirects.
- Bell lists only own last 30, unread count shared; mark-all touches only own rows.
- Matrix save writes rows, logs `user.notifications_updated`; unknown event or channel → 422.
- Broadcast channel refuses another user's id.

Gotchas:
- `afterCommit()` on the notification is not enough when jobs dispatch other jobs — set `after_commit` on the queue connection.
- `toArray()` records the channels actually used; history reads them. Compute from `via()`, never guess.
- Never delay in-app. Quiet hours only hold back channels that buzz a phone.
- Eager-load `notificationPreferences` before filtering many users, or `wantsNotification` runs one query per user.
- Message text, labels, mail subject, action button and bell copy go through `__()`. Recipient's locale, not the actor's: `->locale($user->preferredLocale())`.
- Extra channel (WhatsApp / SMS) only when the user has a number and the gateway env is set; otherwise silently skipped.

Harvested: 2026-10-08 (all from source; bell, matrix and channel tests from standard)
