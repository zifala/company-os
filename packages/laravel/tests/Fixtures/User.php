<?php

declare(strict_types=1);

namespace CompanyOs\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;

final class User extends Model
{
    protected $guarded = [];

    protected $casts = ['active' => 'boolean'];

    /** @var list<string> test-only "permissions" */
    public array $abilities = [];

    public function allows(string $ability): bool
    {
        return in_array($ability, $this->abilities, true);
    }
}
