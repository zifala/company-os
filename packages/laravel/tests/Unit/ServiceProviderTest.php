<?php

declare(strict_types=1);

use CompanyOs\CompanyOsServiceProvider;
use Illuminate\Support\ServiceProvider;

it('merges the package config defaults', function (): void {
    expect(config('company-os.trash'))->toBe(['days' => 30, 'per_page' => 25, 'activity_model' => CompanyOs\Tests\Fixtures\Activity::class])
        ->and(config('company-os.audit_logger'))->toBeNull()
        ->and(config('company-os.lang.audit_events'))->toBe('audit.events');
});

it('offers the config and lang for publishing under their tags', function (): void {
    $config = ServiceProvider::pathsToPublish(CompanyOsServiceProvider::class, 'company-os-config');
    $lang = ServiceProvider::pathsToPublish(CompanyOsServiceProvider::class, 'company-os-lang');

    expect(array_values($config))->toBe([config_path('company-os.php')])
        ->and(array_values($lang))->toBe([app()->langPath('vendor/company-os')])
        ->and(realpath((string) array_key_first($config)))->toBe(realpath(__DIR__.'/../../config/company-os.php'));
});

it('loads the package lang under the company-os namespace', function (): void {
    expect(__('company-os::trash.parent_in_trash'))->toBe('Restore the record this belongs to first.');
});
