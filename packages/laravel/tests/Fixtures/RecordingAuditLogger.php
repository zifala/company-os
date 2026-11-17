<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use CompanyOs\Contracts\AuditLogger;
use Illuminate\Database\Eloquent\Model;

final class RecordingAuditLogger implements AuditLogger
{
    /** @var list<array{event: string, properties: array<string, mixed>}> */
    public array $logged = [];

    public function log(string $event, array $properties = [], ?Model $subject = null, ?Model $causer = null): void
    {
        $this->logged[] = ['event' => $event, 'properties' => $properties];
    }
}
