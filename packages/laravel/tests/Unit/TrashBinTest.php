<?php

declare(strict_types=1);

use CompanyOs\Tests\Fixtures\Activity;
use CompanyOs\Tests\Fixtures\Client;
use CompanyOs\Tests\Fixtures\Note;
use CompanyOs\Tests\Fixtures\User;
use CompanyOs\Trash\TrashBin;
use CompanyOs\Trash\TrashType;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\ValidationException;

beforeEach(function (): void {
    TrashBin::register(TrashType::make('clients', Client::class)
        ->visibleWhen(fn (User $user): bool => $user->allows('clients.delete'))
        ->row(fn (Client $row): array => ['label' => $row->name, 'context' => $row->city])
        ->parent('parent_id'));
    TrashBin::register(TrashType::make('notes', Note::class)
        ->visibleWhen(fn (User $user): bool => $user->allows('notes.delete')));

    $this->user = User::query()->create(['name' => 'Asha']);
    $this->user->abilities = ['clients.delete', 'notes.delete'];
});

function trashed(string $model, array $attributes, int $daysAgo): mixed
{
    $record = $model::query()->create($attributes);
    $record->forceFill(['deleted_at' => now()->subDays($daysAgo)])->save();

    return $record->fresh() ?? $model::withTrashed()->find($record->id);
}

it('keeps the 30-day window', function (): void {
    $this->travelTo(now()->setDate(2026, 3, 31)->setTime(12, 0));

    expect(TrashBin::Days)->toBe(30)
        ->and(TrashBin::days())->toBe(30)
        ->and(TrashBin::cutoff()->toDateTimeString())->toBe('2026-03-01 12:00:00');
});

it('refuses to restore a live record, one past the window, and a child of a trashed parent', function (): void {
    $live = Client::query()->create(['name' => 'Live']);
    $old = trashed(Client::class, ['name' => 'Old'], 31);
    $parent = trashed(Client::class, ['name' => 'Parent'], 1);
    $child = trashed(Client::class, ['name' => 'Child', 'parent_id' => $parent->id], 1);

    $message = function (Closure $guard): ?string {
        try {
            $guard();
        } catch (ValidationException $e) {
            return $e->errors()['trash'][0];
        }

        return null;
    };

    expect($message(fn () => TrashBin::ensureRestorable($live)))->toBe('This record is not in the trash.')
        ->and($message(fn () => TrashBin::ensureRestorable($old)))->toContain('more than 30 days')
        ->and($message(fn () => TrashBin::ensureRestorable($child, $parent)))->toBe('Restore the record this belongs to first.')
        ->and($message(fn () => TrashBin::ensureRestorable($parent)))->toBeNull();
});

it('words guard messages in so, and lets the app override them', function (): void {
    app()->setLocale('so');
    $live = Client::query()->create(['name' => 'Live']);

    expect(fn () => TrashBin::ensureRestorable($live))->toThrow(ValidationException::class, 'Diiwaankan kuma jiro qashinka.');

    Lang::addLines(['trash.not_in_trash' => 'App wording'], 'so');
    expect(fn () => TrashBin::ensureRestorable($live))->toThrow(ValidationException::class, 'App wording');
});

it('computes days left on the server', function (): void {
    $this->travelTo(now()->setTime(12, 0));

    expect(TrashBin::daysLeft(now()))->toBe(30)
        ->and(TrashBin::daysLeft(now()->subDays(10)->subHours(5)))->toBe(20)
        ->and(TrashBin::daysLeft(now()->subDays(45)))->toBe(0);
});

it('merges types newest first with who, reason and days left', function (): void {
    $client = trashed(Client::class, ['name' => 'Acme', 'city' => 'Berbera'], 3);
    $note = trashed(Note::class, ['name' => 'Old note'], 1);
    trashed(Client::class, ['name' => 'Ancient'], 40);
    Client::query()->create(['name' => 'Alive']);
    Activity::logDeletion($client, $this->user, 'first try', 'client.deleted');
    $this->travel(1)->seconds();
    Activity::logDeletion($client, $this->user, 'Duplicate of Acme Ltd', 'client.deleted');

    $rows = TrashBin::for($this->user)->items();

    expect(collect($rows)->pluck('label')->all())->toBe(['Old note', 'Acme'])
        ->and($rows[1])->toMatchArray([
            'type' => 'clients',
            'id' => $client->id,
            'context' => 'Berbera',
            'deleted_by' => 'Asha',
            'reason' => 'Duplicate of Acme Ltd',
            'days_left' => 27,
        ])
        ->and($rows[0]['deleted_by'])->toBeNull();
});

it('filters by type and hides types the user may not delete', function (): void {
    trashed(Client::class, ['name' => 'Acme'], 1);
    trashed(Note::class, ['name' => 'Note'], 1);

    expect(collect(TrashBin::for($this->user, 'notes')->items())->pluck('label')->all())->toBe(['Note']);

    $this->user->abilities = ['notes.delete'];
    expect(collect(TrashBin::types($this->user))->pluck('key')->all())->toBe(['notes'])
        ->and(collect(TrashBin::for($this->user)->items())->pluck('label')->all())->toBe(['Note'])
        ->and(TrashBin::for($this->user, 'clients')->total())->toBe(0);
});

it('hides a type registered without a gate', function (): void {
    TrashBin::flush();
    TrashBin::register(TrashType::make('notes', Note::class));
    trashed(Note::class, ['name' => 'Note'], 1);

    expect(TrashBin::types($this->user))->toBe([])
        ->and(TrashBin::for($this->user)->total())->toBe(0);
});

it('lists a child only as the root of a deletion', function (): void {
    $parent = trashed(Client::class, ['name' => 'Parent'], 2);
    trashed(Client::class, ['name' => 'Child of trashed', 'parent_id' => $parent->id], 2);
    $alive = Client::query()->create(['name' => 'Alive parent']);
    trashed(Client::class, ['name' => 'Child of alive', 'parent_id' => $alive->id], 1);

    expect(collect(TrashBin::for($this->user, 'clients')->items())->pluck('label')->all())->toBe(['Child of alive', 'Parent']);
});

it('applies the per-record filter and paginates in memory', function (): void {
    TrashBin::flush();
    TrashBin::register(TrashType::make('clients', Client::class)
        ->visibleWhen(fn (): bool => true)
        ->recordVisibleWhen(fn (Client $row, User $user): bool => $row->owner_id === $user->id));

    foreach (range(1, 5) as $i) {
        trashed(Client::class, ['name' => "Mine {$i}", 'owner_id' => $this->user->id], $i);
    }
    trashed(Client::class, ['name' => 'Theirs', 'owner_id' => 999], 1);

    $page = TrashBin::for($this->user, null, 2, 2);

    expect($page->total())->toBe(5)
        ->and(collect($page->items())->pluck('label')->all())->toBe(['Mine 3', 'Mine 4']);
});
