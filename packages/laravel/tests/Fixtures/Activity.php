<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/** Stand-in for spatie's Activity model: same table shape the who + reason lookup reads. */
final class Activity extends Model
{
    protected $table = 'activity_log';

    protected $guarded = [];

    protected $casts = ['properties' => 'collection'];

    protected $dateFormat = 'Y-m-d H:i:s.u';

    public function causer(): MorphTo
    {
        return $this->morphTo();
    }

    public static function logDeletion(Model $subject, Model $causer, string $reason, string $event = 'client.deleted'): self
    {
        return self::query()->create([
            'event' => $event,
            'subject_type' => $subject->getMorphClass(),
            'subject_id' => $subject->getKey(),
            'causer_type' => $causer->getMorphClass(),
            'causer_id' => $causer->getKey(),
            'properties' => ['reason' => $reason],
        ]);
    }
}
