<?php

declare(strict_types=1);

use CompanyOs\Audit\NullAuditLogger;
use CompanyOs\Audit\SpatieAuditLogger;
use CompanyOs\CompanyOsServiceProvider;
use CompanyOs\Contracts\AuditLogger;
use CompanyOs\Tests\Fixtures\Client;
use CompanyOs\Tests\Fixtures\FakeActivity;
use CompanyOs\Tests\Fixtures\RecordingAuditLogger;
use CompanyOs\Tests\Fixtures\User;
use Illuminate\Database\Eloquent\Model;

require_once __DIR__.'/../Fixtures/activity.php';

function rebindAuditLogger(): AuditLogger
{
    app()->forgetInstance(AuditLogger::class);
    app()->register(CompanyOsServiceProvider::class, force: true);

    return app(AuditLogger::class);
}

it('binds the no-op logger when spatie is not installed', function (): void {
    expect(function_exists('activity'))->toBeFalse()
        ->and(rebindAuditLogger())->toBeInstanceOf(NullAuditLogger::class);

    (new NullAuditLogger)->log('trash.purged', ['clients' => 1]);
});

it('binds the configured logger class, as a singleton', function (): void {
    config(['company-os.audit_logger' => RecordingAuditLogger::class]);

    $logger = rebindAuditLogger();

    expect($logger)->toBeInstanceOf(RecordingAuditLogger::class)
        ->and(app(AuditLogger::class))->toBe($logger);
});

it('writes event, properties and causer through spatie', function (): void {
    $causer = User::query()->create(['name' => 'Asha']);

    (new SpatieAuditLogger)->log('trash.purged', ['clients' => 2], null, $causer);

    expect(FakeActivity::$last)
        ->event->toBe('trash.purged')
        ->properties->toBe(['clients' => 2])
        ->causer->toBe($causer)
        ->subject->toBeNull()
        ->description->toBe('trash.purged');
});

it('attaches a subject only when its key is a uuid string', function (): void {
    $intSubject = Client::query()->create(['name' => 'Acme']);
    (new SpatieAuditLogger)->log('client.deleted', [], $intSubject);
    expect(FakeActivity::$last->subject)->toBeNull();

    $uuidSubject = new class extends Model
    {
        protected $keyType = 'string';

        public $incrementing = false;
    };
    $uuidSubject->setAttribute('id', '0193b2f4-8c1e-7000-8000-000000000001');

    (new SpatieAuditLogger)->log('client.deleted', [], $uuidSubject);
    expect(FakeActivity::$last->subject)->toBe($uuidSubject)
        ->and(FakeActivity::$last->causer)->toBeNull();
});
