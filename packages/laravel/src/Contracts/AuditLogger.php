<?php

declare(strict_types=1);

namespace CompanyOs\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * The one seam the package uses to write an audit row. The app's own Actions
 * keep calling activity() directly; only package code (PurgeTrash) goes
 * through this, so the package never hard-depends on an activity log.
 */
interface AuditLogger
{
    /** @param  array<string, mixed>  $properties */
    public function log(string $event, array $properties = [], ?Model $subject = null, ?Model $causer = null): void;
}
