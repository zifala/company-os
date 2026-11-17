<?php

declare(strict_types=1);

namespace CompanyOs\Audit;

use CompanyOs\Contracts\AuditLogger;
use Illuminate\Database\Eloquent\Model;

final class NullAuditLogger implements AuditLogger
{
    public function log(string $event, array $properties = [], ?Model $subject = null, ?Model $causer = null): void {}
}
