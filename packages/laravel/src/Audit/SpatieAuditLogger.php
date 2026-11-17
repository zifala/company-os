<?php

declare(strict_types=1);

namespace CompanyOs\Audit;

use CompanyOs\Contracts\AuditLogger;
use Illuminate\Database\Eloquent\Model;

/**
 * spatie/laravel-activitylog. Recipe gotcha: `subject_id` is a uuid, so a
 * subject is only attached when its key is a string (uuid model). Int-id
 * subjects are logged with no subject rather than crashing Postgres.
 */
final class SpatieAuditLogger implements AuditLogger
{
    public function log(string $event, array $properties = [], ?Model $subject = null, ?Model $causer = null): void
    {
        $logger = activity()->event($event)->withProperties($properties);

        if ($subject !== null && is_string($subject->getKey())) {
            $logger->performedOn($subject);
        }

        if ($causer !== null) {
            $logger->causedBy($causer);
        }

        $logger->log($event);
    }
}
