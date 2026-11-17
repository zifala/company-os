<?php

declare(strict_types=1);

use CompanyOs\Support\UserTime;
use CompanyOs\Tests\Fixtures\User;
use Illuminate\Support\Facades\Validator;

it('gives the user their own today, not the server date', function (): void {
    $this->travelTo(now()->setTimezone('UTC')->setDate(2026, 3, 10)->setTime(22, 30));
    $user = new User(['timezone' => 'Africa/Mogadishu']); // UTC+3

    expect(UserTime::today($user)->toDateString())->toBe('2026-03-11')
        ->and(now()->toDateString())->toBe('2026-03-10');
});

it('converts local strings to utc and utc to local', function (): void {
    $user = new User(['timezone' => 'Africa/Mogadishu']);

    expect(UserTime::toUtc('2026-03-11', $user)->toDateTimeString())->toBe('2026-03-10 21:00:00')
        ->and(UserTime::local(new DateTimeImmutable('2026-03-10 21:00:00', new DateTimeZone('UTC')), $user)->format('Y-m-d H:i'))->toBe('2026-03-11 00:00');
});

it('falls back to the app timezone when the user has none', function (): void {
    expect(UserTime::timezone(new User))->toBe('UTC')
        ->and(UserTime::timezone('Europe/London'))->toBe('Europe/London');
});

it('returns the next-morning end for quiet hours across midnight', function (): void {
    $user = new User(['timezone' => 'UTC', 'quiet_hours_start' => '22:00', 'quiet_hours_end' => '07:00']);

    $this->travelTo(now()->setDate(2026, 3, 10)->setTime(23, 15));
    expect(UserTime::quietHoursEnd($user)?->toDateTimeString())->toBe('2026-03-11 07:00:00');

    $this->travelTo(now()->setDate(2026, 3, 11)->setTime(6, 0));
    expect(UserTime::quietHoursEnd($user)?->toDateTimeString())->toBe('2026-03-11 07:00:00');

    $this->travelTo(now()->setDate(2026, 3, 11)->setTime(12, 0));
    expect(UserTime::quietHoursEnd($user))->toBeNull();
});

it('handles a same-day quiet window and unset quiet hours', function (): void {
    $this->travelTo(now()->setDate(2026, 3, 10)->setTime(13, 0));

    expect(UserTime::quietHoursEnd(new User(['timezone' => 'UTC', 'quiet_hours_start' => '12:00', 'quiet_hours_end' => '14:00']))?->format('H:i'))->toBe('14:00')
        ->and(UserTime::quietHoursEnd(new User(['timezone' => 'UTC', 'quiet_hours_start' => '15:00', 'quiet_hours_end' => '16:00'])))->toBeNull()
        ->and(UserTime::quietHoursEnd(new User(['timezone' => 'UTC', 'quiet_hours_start' => '22:00'])))->toBeNull();
});

it('rejects an invalid timezone and half-set quiet hours', function (array $data, bool $passes): void {
    expect(Validator::make($data, UserTime::profileRules())->passes())->toBe($passes);
})->with([
    'valid' => [['timezone' => 'Africa/Mogadishu', 'quiet_hours_start' => '22:00', 'quiet_hours_end' => '07:00'], true],
    'no quiet hours' => [['timezone' => 'UTC'], true],
    'bad timezone' => [['timezone' => 'Mars/Olympus'], false],
    'start only' => [['timezone' => 'UTC', 'quiet_hours_start' => '22:00'], false],
    'end only' => [['timezone' => 'UTC', 'quiet_hours_end' => '07:00'], false],
    'bad format' => [['timezone' => 'UTC', 'quiet_hours_start' => '10pm', 'quiet_hours_end' => '07:00'], false],
]);

it('treats the end of a quiet window as outside it', function (): void {
    $sameDay = new User(['timezone' => 'UTC', 'quiet_hours_start' => '12:00', 'quiet_hours_end' => '14:00']);
    $overnight = new User(['timezone' => 'UTC', 'quiet_hours_start' => '22:00', 'quiet_hours_end' => '07:00']);

    $this->travelTo(now()->setDate(2026, 3, 10)->setTime(12, 0));
    expect(UserTime::quietHoursEnd($sameDay)?->format('H:i'))->toBe('14:00');

    $this->travelTo(now()->setDate(2026, 3, 10)->setTime(14, 0));
    expect(UserTime::quietHoursEnd($sameDay))->toBeNull();

    $this->travelTo(now()->setDate(2026, 3, 10)->setTime(22, 0));
    expect(UserTime::quietHoursEnd($overnight)?->toDateTimeString())->toBe('2026-03-11 07:00:00');

    $this->travelTo(now()->setDate(2026, 3, 11)->setTime(7, 0));
    expect(UserTime::quietHoursEnd($overnight))->toBeNull();
});

it('reads an equal start and end as no quiet hours', function (): void {
    $this->travelTo(now()->setDate(2026, 3, 10)->setTime(9, 0));

    expect(UserTime::quietHoursEnd(new User(['timezone' => 'UTC', 'quiet_hours_start' => '09:00', 'quiet_hours_end' => '09:00'])))->toBeNull();
});

it('works quiet hours out in the user zone and returns that zone', function (): void {
    $this->travelTo(now()->setTimezone('UTC')->setDate(2026, 3, 10)->setTime(20, 0)); // 23:00 in Mogadishu
    $user = new User(['timezone' => 'Africa/Mogadishu', 'quiet_hours_start' => '22:00', 'quiet_hours_end' => '07:00']);

    $end = UserTime::quietHoursEnd($user);

    expect($end?->toDateTimeString())->toBe('2026-03-11 07:00:00')
        ->and($end?->utc()->toDateTimeString())->toBe('2026-03-11 04:00:00');
});

it('reads attribute names from config and accepts plain objects and time columns', function (): void {
    config([
        'company-os.user_time.timezone_attribute' => 'tz',
        'company-os.user_time.quiet_hours_start_attribute' => 'dnd_from',
        'company-os.user_time.quiet_hours_end_attribute' => 'dnd_until',
    ]);
    $this->travelTo(now()->setTimezone('UTC')->setDate(2026, 3, 10)->setTime(23, 0));
    $user = (object) ['tz' => 'Europe/London', 'dnd_from' => '22:00:00', 'dnd_until' => '06:30:00'];

    expect(UserTime::timezone($user))->toBe('Europe/London')
        ->and(UserTime::quietHoursEnd($user)?->toDateTimeString())->toBe('2026-03-11 06:30:00')
        ->and(array_keys(UserTime::profileRules()))->toBe(['tz', 'dnd_from', 'dnd_until']);
});

it('falls back to the app timezone for null and empty strings', function (): void {
    config(['app.timezone' => 'Africa/Nairobi']);

    expect(UserTime::timezone(null))->toBe('Africa/Nairobi')
        ->and(UserTime::timezone(''))->toBe('Africa/Nairobi')
        ->and(UserTime::timezone(new User(['timezone' => ''])))->toBe('Africa/Nairobi');
});

it('reads a local datetime string in the user zone', function (): void {
    expect(UserTime::toUtc('2026-03-11 09:00', 'Africa/Mogadishu')->toDateTimeString())->toBe('2026-03-11 06:00:00')
        ->and(UserTime::toUtc('2026-03-11 09:00', 'Africa/Mogadishu')->getTimezone()->getName())->toBe('UTC');
});
