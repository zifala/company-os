# Trash

Rule: delete is a soft delete with a reason; a trash page lists what the user may restore for 30 days; restore is its own Action; a daily job force-deletes older rows after detaching what must survive, and logs one audit row per run.

Shape:
- `SoftDeletes` on every trashable model. Parent-child models add `deletion_batch` (uuid) so restore brings back exactly what one delete removed.
- `app/Actions/<Model>/Delete<Model>.php` — reason required, audit `<model>.deleted` with `reason`.
- `app/Actions/<Model>/Restore<Model>.php` — guard + `TrashBin::ensureRestorable()` + `restore()` + audit `<model>.restored`.
- `app/Support/TrashBin.php` — `Days = 30`, `cutoff()`, `ensureRestorable()`, `types(User)`, `for(User, ?type)` paginated rows.
- `app/Jobs/PurgeTrash.php` — daily, idempotent.
- `TrashController`: `index`, `restore<Model>` per type. Routes `POST trash/<model>s/{<model>}/restore` with `->withTrashed()`.
- Page `trash/index`: filter by type, row = label, context, deleted date, who + reason, days left, Restore.

Code:

```php
final class TrashBin
{
    public const int Days = 30;

    public static function cutoff(): CarbonInterface
    {
        return now()->subDays(self::Days);
    }

    public static function ensureRestorable(Model $model): void
    {
        if (! $model->getAttribute('deleted_at')) {
            throw ValidationException::withMessages(['trash' => __('trash.not_in_trash')]);
        }

        if ($model->getAttribute('deleted_at')->lt(self::cutoff())) {
            throw ValidationException::withMessages(['trash' => __('trash.too_old', ['days' => self::Days])]);
        }
    }
}
```

```php
final class Delete<Model>
{
    public function handle(<Model> $record, User $actor, array $data): void
    {
        Gate::forUser($actor)->authorize('delete', $record);

        $record->delete();

        activity()->performedOn($record)->causedBy($actor)->event('<model>.deleted')
            ->withProperties(['name' => $record->name, 'reason' => $data['reason']])->log('<model>.deleted');
    }
}
```

- Route: `DELETE <models>/{<model>}` → `destroy(ReasonRequest $request, <Model> $<model>, Delete<Model> $action)` → `$action->handle($<model>, $request->user(), $request->validated())` → redirect to the index with a toast naming the trash.
- UI: delete only from the record's view page through `ReasonDialog` (recipe `status-dialog`) with `confirmName` set: the user types the record's name, then a reason. Consequence text says it stays in trash for 30 days.
- Restore from the trash page through `ConfirmDialog` (label `trash.restore_<model>`). No reason needed.

```php
final class Restore<Model>
{
    public function handle(<Model> $record, User $actor): <Model>
    {
        Gate::forUser($actor)->authorize('delete', $record);
        TrashBin::ensureRestorable($record);

        $record->restore();

        activity()->performedOn($record)->causedBy($actor)->event('<model>.restored')
            ->withProperties(['name' => $record->name])->log('<model>.restored');

        return $record;
    }
}
```

```php
public function handle(): void
{
    $ids = <Model>::onlyTrashed()->where('deleted_at', '<', TrashBin::cutoff())->pluck('id');

    if ($ids->isEmpty()) {
        return;
    }

    DB::transaction(function () use ($ids): void {
        foreach ($ids->chunk(500) as $chunk) {
            <Child>::query()->whereIn('<model>_id', $chunk)->update(['<model>_id' => null]);
            <Model>::withTrashed()->whereIn('parent_id', $chunk)->update(['parent_id' => null]);
            <Model>::onlyTrashed()->whereIn('id', $chunk)->forceDelete();
        }

        activity()->event('trash.purged')->withProperties(['<model>s' => $ids->count()])->log('trash.purged');
    });
}
```

- Trash rows: merge each type's `onlyTrashed()->where('deleted_at', '>=', cutoff())`, sort by `deleted_at` desc, paginate in memory.
- Who + reason: one query on the latest `*.deleted` activity per subject on the current page, keyed by `subject_id`.
- `days_left = max(0, Days - floor(deleted_at->diffInDays(now())))`.
- Per-type section shown only with `<module>.delete`; per-record types filter `$user->can('delete', $record)` and go through `visibleTo`.
- Child rows list only as the root of a deletion (no parent, or parent alive). Restore refuses a child whose parent is still trashed.
- Purge order: detach polymorphic links (reminders, favorites) → null FKs that keep history (logged time keeps its parent id) → force delete. Models with files: `forceDelete()` per model so media is removed; do it outside the DB transaction.
- `Schedule::job(new PurgeTrash)->dailyAt('01:00')->withoutOverlapping()->onOneServer();`
- Records with a lifecycle (archive, close) have no delete → never in trash.

Test:
- Delete without `reason` → 422 on `reason`, record still live; without `delete` permission → 403; GET on the delete URL does nothing.
- Delete → row shows in trash with who, reason and days left; restore brings it back and audits.
- Restore guards: live record refused, older than 30 days refused, trashed parent refused, no permission 403.
- Restoring a parent brings back only its own deletion batch.
- Trash merges types newest first, filters by type, hides types the user may not delete.
- Purge removes only rows past 30 days, keeps dependent history, deletes files, logs one `trash.purged`; nothing to purge → no activity row.
- Purge run twice → no error, no second activity.

Gotchas:
- Route model binding skips trashed rows; restore routes need `->withTrashed()`.
- Every relation and listing that should hide trashed rows gets it for free from `SoftDeletes`; raw joins and `whereIn(… select id)` subqueries do not. Check them.
- Unique columns (slug, email, number) collide with trashed rows. Scope the unique rule `->whereNull('deleted_at')` or keep numbers unique forever.
- Restore must not re-notify or re-run automations.
- Type labels, page copy, empty state (`trash.empty`: nothing here, deletes stay 30 days) and guard messages in `lang/en/trash.php` + `lang/so/trash.php`, never constants.
- Days left is computed in Laravel and sent ready; React never does date math.

Harvested: 2026-10-08 (trash bin, restore, purge from source; delete endpoint + typed-name dialog from standard + rules)
