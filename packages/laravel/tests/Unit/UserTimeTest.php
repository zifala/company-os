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
