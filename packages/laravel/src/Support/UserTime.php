<?php

declare(strict_types=1);

namespace CompanyOs\Support;

use Carbon\CarbonImmutable;
use DateTimeInterface;

/**
 * Recipe `settings`: every user-facing "today" and every local <-> UTC
 * conversion. Store UTC, convert at the edges only. Never
 * now()->toDateString() for a user-facing today.
 *
 * $user is any object carrying the configured timezone attribute (an
 * Eloquent user, a DTO), or a timezone string. Empty -> app timezone.
 */
final class UserTime
{
    public static function timezone(object|string|null $user): string
    {
        $timezone = is_object($user)
            ? data_get($user, (string) config('company-os.user_time.timezone_attribute', 'timezone'))
            : $user;

        return is_string($timezone) && $timezone !== '' ? $timezone : (string) config('app.timezone', 'UTC');
    }

    /** Midnight of the user's local date, as a timezone-less date (for date-column comparisons). */
    public static function today(object|string|null $user): CarbonImmutable
    {
        return CarbonImmutable::parse(CarbonImmutable::now(self::timezone($user))->toDateString());
    }

    /** A local wall-clock string ("2026-01-31" or "2026-01-31 09:00") read in the user's zone, returned in UTC. */
    public static function toUtc(string $local, object|string|null $user): CarbonImmutable
    {
        return CarbonImmutable::parse($local, self::timezone($user))->utc();
    }

    public static function local(DateTimeInterface $at, object|string|null $user): CarbonImmutable
    {
        return CarbonImmutable::instance($at)->setTimezone(self::timezone($user));
    }

    /**
     * When the user's quiet hours end, if they are in them now; null otherwise.
     * Handles windows across midnight (22:00-07:00 -> next morning 07:00).
     * The window is [start, end): at the end minute quiet hours are over.
     * Equal start and end is an empty window, not a 24-hour one.
     * Notifications delay delivery to this moment.
     */
    public static function quietHoursEnd(object $user): ?CarbonImmutable
    {
        $start = data_get($user, (string) config('company-os.user_time.quiet_hours_start_attribute', 'quiet_hours_start'));
        $end = data_get($user, (string) config('company-os.user_time.quiet_hours_end_attribute', 'quiet_hours_end'));

        if (! is_string($start) || ! is_string($end) || $start === '' || $end === '') {
            return null;
        }

        $now = CarbonImmutable::now(self::timezone($user));
        $from = $now->setTimeFromTimeString($start);
        $until = $now->setTimeFromTimeString($end);

        if ($from->equalTo($until)) {
            return null;
        }

        if ($from->lessThan($until)) {
            return $now->greaterThanOrEqualTo($from) && $now->lessThan($until) ? $until : null;
        }

        return match (true) {
            $now->greaterThanOrEqualTo($from) => $until->addDay(),
            $now->lessThan($until) => $until,
            default => null,
        };
    }

    /**
     * Profile validation rules from the recipe, keyed by the configured attribute names.
     *
     * @return array<string, list<string>>
     */
    public static function profileRules(): array
    {
        $timezone = (string) config('company-os.user_time.timezone_attribute', 'timezone');
        $start = (string) config('company-os.user_time.quiet_hours_start_attribute', 'quiet_hours_start');
        $end = (string) config('company-os.user_time.quiet_hours_end_attribute', 'quiet_hours_end');

        return [
            $timezone => ['required', 'timezone:all'],
            $start => ['nullable', 'date_format:H:i', "required_with:{$end}"],
            $end => ['nullable', 'date_format:H:i', "required_with:{$start}"],
        ];
    }
}
