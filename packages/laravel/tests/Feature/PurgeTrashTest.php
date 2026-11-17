<?php

declare(strict_types=1);

use CompanyOs\Contracts\AuditLogger;
use CompanyOs\Jobs\PurgeTrash;
use CompanyOs\Tests\Fixtures\Client;
use CompanyOs\Tests\Fixtures\Note;
use CompanyOs\Trash\TrashBin;
use CompanyOs\Trash\TrashType;
use Illuminate\Support\Collection;

beforeEach(function (): void {
    TrashBin::register(TrashType::make('clients', Client::class)
        ->visibleWhen(fn (): bool => true)
        ->parent('parent_id')
        ->beforePurge(fn (Collection $ids) => Note::withTrashed()->whereIn('client_id', $ids)->update(['client_id' => null])));
    TrashBin::register(TrashType::make('notes', Note::class)->visibleWhen(fn (): bool => true));

    Client::$forceDeletedCount = 0;
});

function trash(mixed $record, int $daysAgo): mixed
{
    $record->forceFill(['deleted_at' => now()->subDays($daysAgo)])->save();

    return $record;
}

function logged(): array
{
    return app(AuditLogger::class)->logged;
}

it('removes only rows past the window, keeps dependent history and logs one trash.purged', function (): void {
    $old = trash(Client::query()->create(['name' => 'Old']), 31);
    $recent = trash(Client::query()->create(['name' => 'Recent']), 29);
    $child = Client::query()->create(['name' => 'Child', 'parent_id' => $old->id]);
    $history = Note::query()->create(['name' => 'Logged time', 'client_id' => $old->id]);
    trash(Note::query()->create(['name' => 'Old note']), 60);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(Client::withTrashed()->find($old->id))->toBeNull()
        ->and(Client::withTrashed()->find($recent->id))->not->toBeNull()
        ->and($child->fresh()->parent_id)->toBeNull()
        ->and($history->fresh())->not->toBeNull()
        ->and($history->fresh()->client_id)->toBeNull()
        ->and(Note::withTrashed()->count())->toBe(1)
        ->and(logged())->toBe([['event' => 'trash.purged', 'properties' => ['clients' => 1, 'notes' => 1]]]);
});

it('logs nothing when there is nothing to purge, and a second run is a no-op', function (): void {
    trash(Client::query()->create(['name' => 'Old']), 31);

    (new PurgeTrash)->handle(app(AuditLogger::class));
    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(logged())->toHaveCount(1);
});

it('logs nothing on an empty trash', function (): void {
    trash(Client::query()->create(['name' => 'Recent']), 2);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(logged())->toBe([]);
});

it('force deletes model by model when the type has files', function (): void {
    TrashBin::flush();
    TrashBin::register(TrashType::make('clients', Client::class)->visibleWhen(fn (): bool => true)->withFiles());
    trash(Client::query()->create(['name' => 'A']), 31);
    trash(Client::query()->create(['name' => 'B']), 31);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(Client::$forceDeletedCount)->toBe(2)
        ->and(Client::withTrashed()->count())->toBe(0);
});

it('runs through the container as a queued job', function (): void {
    trash(Client::query()->create(['name' => 'Old']), 31);

    dispatch_sync(new PurgeTrash);

    expect(logged())->toHaveCount(1);
});
