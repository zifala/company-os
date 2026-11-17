<?php

declare(strict_types=1);

use CompanyOs\Audit\AuditChanges;
use CompanyOs\Tests\Fixtures\Client;

it('logs changed, old and new for the touched fields only', function (): void {
    $client = Client::query()->create(['name' => 'Acme', 'email' => 'a@acme.test', 'city' => 'Hargeisa']);

    $client->fill(['name' => 'Acme Ltd', 'city' => 'Hargeisa']);

    expect(AuditChanges::of($client))->toBe([
        'changed' => ['name'],
        'old' => ['name' => 'Acme'],
        'new' => ['name' => 'Acme Ltd'],
    ]);
});

it('logs long text as its length, never the body', function (): void {
    $client = Client::query()->create(['name' => 'Acme', 'notes' => 'short']);

    $client->notes = str_repeat('x', 201);

    expect(AuditChanges::of($client))->toBe([
        'changed' => ['notes'],
        'old' => ['notes' => 'short'],
        'new' => ['notes' => ['length' => 201]],
    ]);
});

it('leaves out timestamps, hidden attributes and explicit exceptions', function (): void {
    $client = Client::query()->create(['name' => 'Acme']);

    $client->fill(['name' => 'B', 'email' => 'b@b.test', 'secret' => 'token', 'updated_at' => now()->addDay()]);

    expect(AuditChanges::of($client, ['email'])['changed'])->toBe(['name']);
});
