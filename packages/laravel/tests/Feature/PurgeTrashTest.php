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

it('purges past a configured window', function (): void {
    config(['company-os.trash.days' => 7]);
    trash(Client::query()->create(['name' => 'Eight']), 8);
    trash(Client::query()->create(['name' => 'Six']), 6);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(Client::withTrashed()->pluck('name')->all())->toBe(['Six'])
        ->and(logged()[0]['properties'])->toBe(['clients' => 1]);
});

it('purges on a custom soft-delete column and leaves live rows alone', function (): void {
    TrashBin::register(TrashType::make('archives', CompanyOs\Tests\Fixtures\Archive::class)->visibleWhen(fn (): bool => true));
    $old = CompanyOs\Tests\Fixtures\Archive::query()->create(['name' => 'Old']);
    $old->forceFill(['archived_at' => now()->subDays(31)])->save();
    CompanyOs\Tests\Fixtures\Archive::query()->create(['name' => 'Live']);
    Client::query()->create(['name' => 'Live client']);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(CompanyOs\Tests\Fixtures\Archive::withTrashed()->pluck('name')->all())->toBe(['Live'])
        ->and(Client::query()->count())->toBe(1)
        ->and(logged())->toBe([['event' => 'trash.purged', 'properties' => ['archives' => 1]]]);
});

it('hands beforePurge each chunk of ids, as a list', function (): void {
    $seen = [];
    TrashBin::flush();
    TrashBin::register(TrashType::make('notes', Note::class)->beforePurge(function (Collection $ids) use (&$seen): void {
        $seen[] = $ids->all();
    }));
    $ids = collect(range(1, PurgeTrash::Chunk + 1))->map(fn (int $i): int => trash(Note::query()->create(['name' => "N{$i}"]), 31)->id);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect($seen)->toHaveCount(2)
        ->and(array_keys($seen[1]))->toBe([0])
        ->and([...$seen[0], ...$seen[1]])->toBe($ids->all())
        ->and(Note::withTrashed()->count())->toBe(0)
        ->and(logged()[0]['properties'])->toBe(['notes' => PurgeTrash::Chunk + 1]);
});

it('purges types that are hidden from the trash page too', function (): void {
    TrashBin::flush();
    TrashBin::register(TrashType::make('notes', Note::class));
    trash(Note::query()->create(['name' => 'Old']), 31);

    (new PurgeTrash)->handle(app(AuditLogger::class));

    expect(Note::withTrashed()->count())->toBe(0);
});

it('rolls the chunk back when beforePurge fails', function (): void {
    TrashBin::flush();
    TrashBin::register(TrashType::make('notes', Note::class)->beforePurge(fn () => throw new RuntimeException('detach failed')));
    trash(Note::query()->create(['name' => 'Old']), 31);

    expect(fn () => (new PurgeTrash)->handle(app(AuditLogger::class)))->toThrow(RuntimeException::class, 'detach failed')
        ->and(Note::withTrashed()->count())->toBe(1)
        ->and(logged())->toBe([]);
});
