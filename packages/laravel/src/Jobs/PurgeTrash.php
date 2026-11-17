<?php

declare(strict_types=1);

namespace CompanyOs\Jobs;

use CompanyOs\Contracts\AuditLogger;
use CompanyOs\Trash\TrashBin;
use CompanyOs\Trash\TrashType;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Recipe `trash`: daily, idempotent. Force-deletes rows trashed longer than
 * the window, after detaching what must survive, and logs one `trash.purged`
 * row per run (none when nothing was purged).
 *
 *   Schedule::job(new PurgeTrash)->dailyAt('01:00')->withoutOverlapping()->onOneServer();
 *
 * Order per chunk: beforePurge (detach polymorphic links, null FKs that keep
 * history) -> null the parent column on children -> force delete. Types
 * with files are force-deleted model by model, outside the transaction.
 */
final class PurgeTrash implements ShouldQueue
{
    use Queueable;

    public const int Chunk = 500;

    public function handle(AuditLogger $logger): void
    {
        $counts = [];

        foreach (TrashBin::registered() as $key => $type) {
            $query = $type->trashedQuery();
            $ids = $query->where($type->deletedAtColumn(), '<', TrashBin::cutoff())->pluck($query->getModel()->getKeyName());

            if ($ids->isNotEmpty()) {
                $this->purge($type, $ids);
                $counts[$key] = $ids->count();
            }
        }

        if ($counts !== []) {
            $logger->log('trash.purged', $counts);
        }
    }

    /** @param Collection<int, mixed> $ids */
    private function purge(TrashType $type, Collection $ids): void
    {
        DB::transaction(function () use ($type, $ids): void {
            foreach ($ids->chunk(self::Chunk) as $chunk) {
                $type->runBeforePurge($chunk->values());

                if ($type->parentColumn !== null && $type->parentModel === $type->model) {
                    ($type->model)::query()->withTrashed()->whereIn($type->parentColumn, $chunk)->update([$type->parentColumn => null]);
                }

                if (! $type->withFiles) {
                    $type->trashedQuery()->whereKey($chunk->all())->forceDelete();
                }
            }
        });

        if ($type->withFiles) {
            foreach ($ids->chunk(self::Chunk) as $chunk) {
                $type->trashedQuery()->whereKey($chunk->all())->get()->each->forceDelete();
            }
        }
    }
}
