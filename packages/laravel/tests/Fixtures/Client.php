<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Client extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $hidden = ['secret'];

    public static int $forceDeletedCount = 0;

    protected static function booted(): void
    {
        static::forceDeleted(function (): void {
            self::$forceDeletedCount++;
        });
    }
}
