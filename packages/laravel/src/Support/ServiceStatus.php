<?php

declare(strict_types=1);

namespace CompanyOs\Support;

use Closure;

/**
 * Recipe `settings`: secrets stay in env; the UI only says ok / missing plus
 * the env names to set, never values. Checks read config(), never env():
 * config caching makes env() null in production.
 *
 * Mail and queue are built in. Register more in a service provider's boot():
 *   ServiceStatus::register('sms', fn () => filled(config('services.sms.key')), ['SMS_KEY']);
 * Labels: app `lang/<locale>/services.php` key, then the package's.
 */
final class ServiceStatus
{
    /** @var array<string, array{check: Closure(): bool, env: list<string>}> */
    private static array $services = [];

    private static bool $withDefaults = true;

    /** @param list<string> $env */
    public static function register(string $key, Closure $check, array $env): void
    {
        self::$services[$key] = ['check' => $check, 'env' => array_values($env)];
    }

    /** Drop the built-in mail + queue rows. */
    public static function withoutDefaults(): void
    {
        self::$withDefaults = false;
    }

    public static function flush(): void
    {
        self::$services = [];
        self::$withDefaults = true;
    }

    /** @return list<array{key: string, label: string, ok: bool, env: list<string>}> */
    public static function rows(): array
    {
        $services = self::$withDefaults ? [...self::defaults(), ...self::$services] : self::$services;
        $rows = [];

        foreach ($services as $key => $service) {
            $rows[] = [
                'key' => $key,
                'label' => Label::appOrPackage('services', 'services', $key),
                'ok' => (bool) ($service['check'])(),
                'env' => $service['env'],
            ];
        }

        return $rows;
    }

    public static function allOk(): bool
    {
        return collect(self::rows())->every('ok');
    }

    /** @return array<string, array{check: Closure(): bool, env: list<string>}> */
    private static function defaults(): array
    {
        return [
            'mail' => [
                'check' => fn (): bool => ! in_array(config('mail.default'), [null, '', 'log', 'array'], true),
                'env' => ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS'],
            ],
            'queue' => [
                'check' => fn (): bool => ! in_array(config('queue.default'), [null, '', 'sync'], true),
                'env' => ['QUEUE_CONNECTION'],
            ],
        ];
    }
}
