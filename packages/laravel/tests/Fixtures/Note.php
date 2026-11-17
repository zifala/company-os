<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Note extends Model
{
    use SoftDeletes;

    protected $guarded = [];
}
