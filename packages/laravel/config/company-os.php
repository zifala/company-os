<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Audit logger
    |--------------------------------------------------------------------------
    | Class implementing CompanyOs\Contracts\AuditLogger. null = auto: the
    | spatie/laravel-activitylog logger when `activity()` exists, else a no-op.
    | Used by PurgeTrash for its one `trash.purged` row per run.
    */
    'audit_logger' => null,

    /*
    |--------------------------------------------------------------------------
    | Trash (recipe: trash)
    |--------------------------------------------------------------------------
    | `days` is the restore window. The standard says 30; change it only with
    | a reason, because the UI copy ("stays in trash for 30 days") reads it.
    | `activity_model` is the model the who + reason lookup reads `*.deleted`
    | rows from. null = config('activitylog.activity_model') when spatie is
    | installed, else the lookup is skipped (rows carry no who / reason).
    */
    'trash' => [
        'days' => 30,
        'per_page' => 25,
        'activity_model' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | User time (recipe: settings)
    |--------------------------------------------------------------------------
    | Attribute names read off whatever user object the app passes in. A
    | missing or empty timezone falls back to config('app.timezone').
    */
    'user_time' => [
        'timezone_attribute' => 'timezone',
        'quiet_hours_start_attribute' => 'quiet_hours_start',
        'quiet_hours_end_attribute' => 'quiet_hours_end',
    ],

    /*
    |--------------------------------------------------------------------------
    | App lang prefixes
    |--------------------------------------------------------------------------
    | App-specific labels (group names, step titles, event names) live in the
    | app's own lang files under these prefixes, e.g. `search.groups.clients`
    | in lang/en/search.php. Generic package strings live in the
    | `company-os::` namespace and can be overridden by publishing them to
    | lang/vendor/company-os, or by defining the same key in the app file
    | (app key wins, package key is the fallback).
    */
    'lang' => [
        'audit_events' => 'audit.events',
        'search_groups' => 'search.groups',
        'setup_steps' => 'setup.steps',
        'setup_links' => 'setup.links',
        'services' => 'services',
        'trash' => 'trash',
    ],

];
