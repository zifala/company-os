<?php

declare(strict_types=1);

use CompanyOs\Setup\SetupSteps;
use CompanyOs\Support\ServiceStatus;
use CompanyOs\Tests\Fixtures\Client;
use CompanyOs\Tests\Fixtures\User;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Route;

beforeEach(function (): void {
    Route::get('organization/users', fn () => 'ok')->name('organization.users.index');
    app('router')->getRoutes()->refreshNameLookups();

    SetupSteps::register('team', fn (): bool => User::query()->where('active', true)->count() > 1, [
        SetupSteps::route('users', 'organization.users.index'),
    ]);
    SetupSteps::register('clients', fn (): bool => Client::query()->exists());
    SetupSteps::register('billing', null, [['billing', '/organization/billing']]);
});

it('flips done from false to true as the data appears; review steps stay null', function (): void {
    expect(collect(SetupSteps::all())->pluck('done', 'key')->all())->toBe(['team' => false, 'clients' => false, 'billing' => null]);

    User::query()->create(['name' => 'A']);
    User::query()->create(['name' => 'B']);
    Client::query()->create(['name' => 'Acme']);

    expect(collect(SetupSteps::all())->pluck('done', 'key')->all())->toBe(['team' => true, 'clients' => true, 'billing' => null]);
});

it('ignores review-only steps when deciding complete', function (): void {
    expect(SetupSteps::complete())->toBeFalse();

    User::query()->create(['name' => 'A']);
    User::query()->create(['name' => 'B']);
    Client::query()->create(['name' => 'Acme']);

    expect(SetupSteps::complete())->toBeTrue();
});

it('builds relative hrefs and lang titles and link labels', function (): void {
    Lang::addLines(['setup.steps.team' => 'Invite your team', 'setup.links.users' => 'Users'], 'en');

    $team = SetupSteps::all()[0];

    expect($team['title'])->toBe('Invite your team')
        ->and($team['links'])->toBe([['label' => 'Users', 'href' => '/organization/users']])
        ->and(SetupSteps::all()[2]['title'])->toBe('billing');
});

it('ticks the services step only when every service is ok', function (): void {
    SetupSteps::flush();
    SetupSteps::services();

    config(['mail.default' => 'log', 'queue.default' => 'database']);
    expect(SetupSteps::all()[0]['done'])->toBeFalse();

    config(['mail.default' => 'smtp']);
    expect(SetupSteps::all()[0]['done'])->toBeTrue()
        ->and(ServiceStatus::allOk())->toBeTrue();
});

it('words the status badge from lang', function (): void {
    expect([SetupSteps::status(true), SetupSteps::status(false), SetupSteps::status(null)])->toBe(['Done', 'To do', 'Review']);

    app()->setLocale('so');
    expect(SetupSteps::status(true))->toBe('Dhammaaday');
});
