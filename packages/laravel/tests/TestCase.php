<?php

declare(strict_types=1);

namespace CompanyOs\Tests;

use CompanyOs\CompanyOsServiceProvider;
use CompanyOs\Contracts\AuditLogger;
use CompanyOs\Search\GlobalSearch;
use CompanyOs\Setup\SetupSteps;
use CompanyOs\Support\ServiceStatus;
use CompanyOs\Tests\Fixtures\RecordingAuditLogger;
use CompanyOs\Trash\TrashBin;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();

        GlobalSearch::flush();
        SetupSteps::flush();
        ServiceStatus::flush();
        TrashBin::flush();

        $this->app->singleton(AuditLogger::class, RecordingAuditLogger::class);
        $this->createTables();
    }

    protected function getPackageProviders($app): array
    {
        return [CompanyOsServiceProvider::class];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('database.default', 'testing');
        $app['config']->set('database.connections.testing', ['driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '']);
        $app['config']->set('app.timezone', 'UTC');
        $app['config']->set('company-os.trash.activity_model', Fixtures\Activity::class);
    }

    private function createTables(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('timezone')->default('UTC');
            $table->string('quiet_hours_start')->nullable();
            $table->string('quiet_hours_end')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('number')->nullable();
            $table->string('city')->nullable();
            $table->text('notes')->nullable();
            $table->string('secret')->nullable();
            $table->foreignId('parent_id')->nullable();
            $table->foreignId('owner_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('notes', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->foreignId('client_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('archives', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
            $table->timestamp('archived_at')->nullable();
        });

        Schema::create('activity_log', function (Blueprint $table): void {
            $table->id();
            $table->string('event')->index();
            $table->nullableMorphs('subject');
            $table->nullableMorphs('causer');
            $table->json('properties')->nullable();
            $table->timestamps(6);
        });
    }
}
