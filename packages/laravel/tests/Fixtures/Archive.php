<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/** Soft deletes on a custom column, to prove nothing hardcodes `deleted_at`. */
final class Archive extends Model
{
    use SoftDeletes;

    public const DELETED_AT = 'archived_at';

    protected $guarded = [];
}
