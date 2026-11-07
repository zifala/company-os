# Calendar feed

Rule: each user gets one secret ICS URL; only the token's hash is stored, the token is shown once, a new one replaces the old, revoke kills it, and the feed lists only that user's own dated items.

Shape:
- `users.calendar_feed_token_hash` (nullable string, in `#[Hidden]`).
- `app/Actions/User/CreateCalendarFeed.php` — returns the plain token. Audit `calendar_feed.created` with `replaced`.
- `app/Actions/User/RevokeCalendarFeed.php` — audit `calendar_feed.revoked`. No feed → refused.
- `app/Support/CalendarFeed.php` — `for(User): string`, `events(User): Collection` of rows `{uid, summary, url, start, end, all_day, alarm}`.
- `app/Support/IcsCalendar.php` — `render(name, events)`, `escape()`, `fold()`. No package.
- `Settings/CalendarFeedController`: `store` (password confirm), `destroy`, `show` (public).
- Routes:
  - `POST settings/calendar-feed` → `RequirePassword` middleware, `calendar-feed.store`.
  - `DELETE settings/calendar-feed` → `calendar-feed.destroy`.
  - `GET calendar/feed/{token}.ics` outside auth, `where('token', '[A-Za-z0-9]{40}')`, `throttle:30,1`, `calendar-feed.show`.
- UI: on `Settings/notifications` — on / off state, "Create link", the new URL from flash once, "Revoke".

Code:

```php
final class CreateCalendarFeed
{
    public function handle(User $user): string
    {
        $token = Str::random(40);
        $replaced = $user->calendar_feed_token_hash !== null;

        $user->update(['calendar_feed_token_hash' => hash('sha256', $token)]);

        activity()->performedOn($user)->causedBy($user)->event('calendar_feed.created')
            ->withProperties(['replaced' => $replaced])->log('calendar_feed.created');

        return $token;
    }
}
```

```php
public function show(string $token): Response
{
    $user = User::query()->active()->where('calendar_feed_token_hash', hash('sha256', $token))->firstOrFail();

    return response(CalendarFeed::for($user), 200, ['Content-Type' => 'text/calendar; charset=utf-8']);
}

public function store(Request $request, CreateCalendarFeed $createCalendarFeed): RedirectResponse
{
    return back()->with('calendarFeedUrl', route('calendar-feed.show', $createCalendarFeed->handle($request->user())));
}
```

```php
public static function render(string $name, iterable $events): string
{
    $lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//'.config('app.name').'//Calendar feed//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:'.self::escape($name)];
    $stamp = CarbonImmutable::now('UTC')->format('Ymd\THis\Z');

    foreach ($events as $event) {
        array_push($lines, 'BEGIN:VEVENT', "UID:{$event['uid']}", "DTSTAMP:{$stamp}",
            self::time('DTSTART', $event['start'], $event['all_day']),
            self::time('DTEND', $event['end'], $event['all_day']),
            'SUMMARY:'.self::escape($event['summary']), 'URL:'.$event['url']);

        if ($event['alarm'] !== null) {
            array_push($lines, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:'.self::escape($event['summary']), "TRIGGER:{$event['alarm']}", 'END:VALARM');
        }

        $lines[] = 'END:VEVENT';
    }

    $lines[] = 'END:VCALENDAR';

    return implode('', array_map(fn (string $line): string => self::fold($line)."\r\n", $lines));
}

public static function escape(string $text): string
{
    return str_replace(['\\', ';', ',', "\r\n", "\n", "\r"], ['\\\\', '\\;', '\\,', '\\n', '\\n', '\\n'], $text);
}

private static function time(string $property, CarbonImmutable $at, bool $allDay): string
{
    return $allDay ? "{$property};VALUE=DATE:".$at->format('Ymd') : "{$property}:".$at->utc()->format('Ymd\THis\Z');
}
```

- `fold()`: split on `mb_str_split` characters, break when the byte length would pass 75 octets (74 after the first line, the leading space counts), join with `"\r\n "`.
- Window: 30 days back, 180 ahead, in the user's local dates.
- What goes in: events I organize or attend (timed, alarm `-PT15M`; all-day → `VALUE=DATE`, end +1 day), my open reminders (alarm `PT0M`), my open `<model>s` with a due date (all-day, no alarm).
- UID: `"<kind>-{$id}@".parse_url(config('app.url'), PHP_URL_HOST)`. Stable, so calendar apps update instead of duplicate.

Test:
- Create stores only the sha256 hash, returns the token once; second create replaces it and the old URL 404s.
- Revoke clears the hash, is audited, and a second revoke is refused.
- Store needs password confirmation; the settings page then shows the new URL once.
- Feed lists my events, reminders and due `<model>s`; not other users' items; canceled / done items absent.
- Text with `;`, `,`, newlines is escaped; a long summary folds at 75 octets with multibyte safe splits.
- Unknown, revoked and deactivated-user tokens → 404.
- Owner with locale `so` gets the Somali calendar name.

Gotchas:
- Never store or log the plain token. Lookup is by hash; compare inside the query.
- Feed route sits outside `auth` — the token is the auth. Throttle it and constrain the token pattern.
- `.ics` URL leaks to calendar providers. Feed shows titles and links only, never amounts, notes or contact details.
- Deactivating a user must stop the feed: query `active()` in `show`.
- Timed events in UTC (`Z`); all-day events as plain dates in the user's local day, never shifted through UTC.
- CRLF line endings and folding are required; some clients reject LF-only files.
- Refusal message in `RevokeCalendarFeed` and UI copy through `__()`.
- Public route has no session locale: wrap `CalendarFeed::for()` in `App::setLocale($user->preferredLocale())` so the calendar name and item prefixes match the owner's language.

Harvested: 2026-10-08 (all from source; owner locale from standard)
