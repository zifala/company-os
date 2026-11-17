<?php

declare(strict_types=1);

use CompanyOs\Search\GlobalSearch;
use CompanyOs\Search\TextSearch;
use CompanyOs\Tests\Fixtures\Client;
use CompanyOs\Tests\Fixtures\Note;
use CompanyOs\Tests\Fixtures\User;
use Illuminate\Support\Facades\Lang;

beforeEach(function (): void {
    GlobalSearch::group('clients',
        query: fn (User $user) => $user->allows('clients.view-any') ? Client::query()->where('owner_id', $user->id) : null,
        columns: ['name', 'email'],
        map: fn (Client $row): array => ['id' => $row->id, 'label' => $row->name, 'url' => "/clients/{$row->id}"],
        code: 'number',
    );
    GlobalSearch::group('notes',
        query: fn (User $user) => Note::query(),
        columns: ['name'],
        map: fn (Note $row): array => ['id' => $row->id, 'label' => $row->name, 'url' => "/notes/{$row->id}"],
    );

    $this->user = User::query()->create(['name' => 'Viewer']);
    $this->user->abilities = ['clients.view-any'];
});

it('returns nothing under two characters', function (): void {
    Client::query()->create(['name' => 'Acme', 'owner_id' => $this->user->id]);

    expect(GlobalSearch::groups($this->user, ' a '))->toBe([])
        ->and(GlobalSearch::groups($this->user, 'ac'))->toHaveCount(1);
});

it('returns only records the user can see and skips groups without permission', function (): void {
    Client::query()->create(['name' => 'Acme mine', 'owner_id' => $this->user->id]);
    Client::query()->create(['name' => 'Acme theirs', 'owner_id' => 999]);

    expect(collect(GlobalSearch::groups($this->user, 'acme')[0]['items'])->pluck('label')->all())->toBe(['Acme mine']);

    $this->user->abilities = [];
    expect(GlobalSearch::groups($this->user, 'acme'))->toBe([]);
});

it('matches % and _ literally', function (): void {
    Client::query()->create(['name' => '100% cotton', 'owner_id' => $this->user->id]);
    Client::query()->create(['name' => '1000 cotton', 'owner_id' => $this->user->id]);
    Client::query()->create(['name' => 'a_b', 'owner_id' => $this->user->id]);
    Client::query()->create(['name' => 'axb', 'owner_id' => $this->user->id]);

    $labels = fn (string $term): array => collect(GlobalSearch::groups($this->user, $term)[0]['items'] ?? [])->pluck('label')->all();

    expect($labels('0%'))->toBe(['100% cotton'])
        ->and($labels('a_b'))->toBe(['a_b']);
});

it('caps each group at PerGroup, exact code first, then newest updated_at', function (): void {
    foreach (range(1, 7) as $i) {
        Client::query()->create(['name' => "Acme {$i}", 'number' => "C-00{$i}", 'owner_id' => $this->user->id, 'updated_at' => now()->subDays(10 - $i)]);
    }
    Client::query()->create(['name' => 'Other', 'number' => 'ACME', 'owner_id' => $this->user->id, 'updated_at' => now()->subYear()]);

    $labels = collect(GlobalSearch::groups($this->user, 'acme')[0]['items'])->pluck('label')->all();

    expect($labels)->toHaveCount(GlobalSearch::PerGroup)
        ->and($labels)->toBe(['Other', 'Acme 7', 'Acme 6', 'Acme 5', 'Acme 4']);
});

it('never returns trashed records', function (): void {
    Client::query()->create(['name' => 'Acme gone', 'owner_id' => $this->user->id])->delete();
    Note::query()->create(['name' => 'Acme note'])->delete();

    expect(GlobalSearch::groups($this->user, 'acme'))->toBe([]);
});

it('names groups from the app lang in the current locale', function (): void {
    Lang::addLines(['search.groups.clients' => 'Clients'], 'en');
    Lang::addLines(['search.groups.clients' => 'Macaamiisha'], 'so');
    Client::query()->create(['name' => 'Acme', 'owner_id' => $this->user->id]);

    expect(GlobalSearch::groups($this->user, 'acme')[0]['name'])->toBe('Clients');

    app()->setLocale('so');
    expect(GlobalSearch::groups($this->user, 'acme')[0])->toMatchArray(['key' => 'clients', 'name' => 'Macaamiisha']);
});

it('escapes per driver', function (): void {
    expect(TextSearch::escape(' 50%_\\ '))->toBe('50\%\_\\\\')
        ->and(TextSearch::escape('[a]', 'sqlsrv'))->toBe('\[a]');
});
