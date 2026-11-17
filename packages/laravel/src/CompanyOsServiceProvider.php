<?php

declare(strict_types=1);

namespace CompanyOs;

use CompanyOs\Audit\NullAuditLogger;
use CompanyOs\Audit\SpatieAuditLogger;
use CompanyOs\Contracts\AuditLogger;
use Illuminate\Support\ServiceProvider;

final class CompanyOsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/company-os.php', 'company-os');

        $this->app->singleton(AuditLogger::class, function ($app): AuditLogger {
            $class = $app['config']->get('company-os.audit_logger');

            if (is_string($class) && $class !== '') {
                return $app->make($class);
            }

            return function_exists('activity') ? new SpatieAuditLogger : new NullAuditLogger;
        });
    }

    public function boot(): void
    {
        $this->loadTranslationsFrom(__DIR__.'/../lang', 'company-os');

        if ($this->app->runningInConsole()) {
            $this->publishes([__DIR__.'/../config/company-os.php' => config_path('company-os.php')], 'company-os-config');
            $this->publishes([__DIR__.'/../lang' => $this->app->langPath('vendor/company-os')], 'company-os-lang');
        }
    }
}
