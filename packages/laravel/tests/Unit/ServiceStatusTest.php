<?php

declare(strict_types=1);

use CompanyOs\Support\ServiceStatus;
use Illuminate\Support\Facades\Lang;

it('reads missing on an empty config and ok once keys are set', function (): void {
    config(['mail.default' => null, 'queue.default' => null]);
    expect(collect(ServiceStatus::rows())->pluck('ok', 'key')->all())->toBe(['mail' => false, 'queue' => false]);

    config(['mail.default' => 'log', 'queue.default' => 'sync']);
    expect(ServiceStatus::allOk())->toBeFalse();

    config(['mail.default' => 'smtp', 'queue.default' => 'database']);
    expect(ServiceStatus::allOk())->toBeTrue();
});

it('carries env names, never config values', function (): void {
    config(['mail.default' => 'smtp', 'mail.mailers.smtp.password' => 'hunter2']);

    $json = json_encode(ServiceStatus::rows());

    expect($json)->not->toContain('hunter2')->not->toContain('smtp')
        ->and(ServiceStatus::rows()[0]['env'])->toBe(['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS']);
});

it('takes app-registered services and labels them from lang, app key first', function (): void {
    config(['services.sms.key' => null]);
    ServiceStatus::register('sms', fn (): bool => filled(config('services.sms.key')), ['SMS_KEY']);
    Lang::addLines(['services.sms' => 'SMS gateway'], 'en');

    $sms = collect(ServiceStatus::rows())->firstWhere('key', 'sms');
    expect($sms)->toBe(['key' => 'sms', 'label' => 'SMS gateway', 'ok' => false, 'env' => ['SMS_KEY']]);

    config(['services.sms.key' => 'set']);
    expect(collect(ServiceStatus::rows())->firstWhere('key', 'sms')['ok'])->toBeTrue();
});

it('labels the built-in rows from the package lang in en and so', function (): void {
    expect(ServiceStatus::rows()[0]['label'])->toBe('Email');

    app()->setLocale('so');
    expect(ServiceStatus::rows()[0]['label'])->toBe('Iimayl');
});

it('can drop the built-in rows', function (): void {
    ServiceStatus::withoutDefaults();

    expect(ServiceStatus::rows())->toBe([]);
});
