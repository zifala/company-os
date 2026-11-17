<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;

/** Records the spatie `activity()` fluent calls SpatieAuditLogger makes. */
final class FakeActivity
{
    public static ?self $last = null;

    public ?string $event = null;

    /** @var array<string, mixed> */
    public array $properties = [];

    public ?Model $subject = null;

    public ?Model $causer = null;

    public ?string $description = null;

    public function event(string $event): self
    {
        $this->event = $event;

        return $this;
    }

    /** @param array<string, mixed> $properties */
    public function withProperties(array $properties): self
    {
        $this->properties = $properties;

        return $this;
    }

    public function performedOn(Model $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function causedBy(Model $causer): self
    {
        $this->causer = $causer;

        return $this;
    }

    public function log(string $description): void
    {
        $this->description = $description;
    }
}
