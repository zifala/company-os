# Views, favorites, import, export

Rule: a list's URL query is its state; saved views store that query, favorites pin any viewable record, imports preview before they write, exports stream what the list shows.

Shape:
- `saved_views`: uuid `id`, `user_id`, nullable `<container>_id`, `name`, `scope` (`SavedViewScope`: `Personal`, `Shared`), json `filters`, `layout`, nullable `group_by`, `sort`. Index (`<container>_id`, `scope`).
- `favorites`: uuid `id`, `user_id`, `uuidMorphs('favoritable')`, `position`. Unique (`user_id`, type, id). Index (`user_id`, `position`).
- `app/Actions/SavedView/` — `CreateSavedView`, `UpdateSavedView`, `DeleteSavedView`, `SavedViewRules` (name free, may share, clean definition).
- `app/Actions/Favorite/` — `AddFavorite`, `RemoveFavorite`, `ReorderFavorites`.
- `app/Support/SavedViews::props(User, ?<Container>)` and `Favorites::for(User)` → shared Inertia props (`savedViews` per list, `favorites` global).
- `app/Support/CsvRows` — read any CSV into `[line, values]`. `ImportRow` — place a row into the plan. `<Model>Csv::Aliases`, `<Model>ImportPlan::classify()`.
- `app/Actions/<Model>/Import<Models>` — dry run or write. Routes `GET|POST <models>/import`.
- `app/Support/RecordCsv::write()` + `<models>/export` route per exportable list.
- React: `saved-views-menu`, `save-view-dialog`, `saved-view-query.ts`, `favorite-button`, `nav-favorites`, `csv-import`, `import-preview`, `export-button`.

Code:

```php
public function scopeVisibleIn(Builder $query, User $user, ?<Container> $container): void
{
    $query->where('<container>_id', $container?->id)
        ->where(fn (Builder $visible) => $visible->where('user_id', $user->id)->orWhere('scope', SavedViewScope::Shared));
}

public function urlQuery(): array
{
    return array_filter([...$this->filters, 'view' => $this->layout->value, 'group' => $this->group_by, 'sort' => $this->sort],
        fn (?string $value): bool => $value !== null && $value !== '');
}
```

- `SavedViewRules::definition()` keeps only the list's known filter keys (`<Model>Filters::Keys`), non-empty strings; drops `group_by` when the layout cannot group.
- `nameFree()` checks names across `visibleIn` → `ValidationException` on `name`. `mayShare()` authorizes a stronger ability before `Shared`.
- Policy: owner updates; owner or an admin of the place deletes a shared view. Delete also removes its favorites.

```php
public function handle(Model $target, User $actor): Favorite
{
    if (! $actor->can('view', $target)) {
        throw new AuthorizationException;
    }
    if (Favorite::query()->where('user_id', $actor->id)->whereMorphedTo('favoritable', $target)->exists()) {
        throw ValidationException::withMessages(['id' => __('favorites.already')]);
    }

    return DB::transaction(function () use ($target, $actor): Favorite {
        $favorite = Favorite::query()->create([
            'user_id' => $actor->id,
            'favoritable_type' => $target->getMorphClass(),
            'favoritable_id' => $target->getKey(),
            'position' => (int) Favorite::query()->where('user_id', $actor->id)->max('position') + 1,
        ]);
        activity()->performedOn($target)->causedBy($actor)->event('favorite.added')->log('favorite.added');

        return $favorite;
    });
}
```

- `Favorites::for()` re-checks `view` on every row → lost access drops the favorite from the sidebar without a write.
- `ReorderFavorites` takes the full id list; refuses if it differs from the stored set (stale tab).

```php
private static function utf8(string $csv): string
{
    return match (true) {
        str_starts_with($csv, "\xFF\xFE") => mb_convert_encoding(substr($csv, 2), 'UTF-8', 'UTF-16LE'),
        str_starts_with($csv, "\xFE\xFF") => mb_convert_encoding(substr($csv, 2), 'UTF-8', 'UTF-16BE'),
        str_starts_with($csv, "\xEF\xBB\xBF") => substr($csv, 3),
        mb_check_encoding($csv, 'UTF-8') => $csv,
        default => mb_convert_encoding($csv, 'UTF-8', 'Windows-1252'),
    };
}
```

- `CsvRows::read($csv, $aliases)`: delimiter = most frequent of `,` `;` `\t` in the header; headers → `Str::snake(Str::lower())` → alias map; unknown columns ignored; `name` column required; blank rows skipped; > `MaxRows` (1000) → error on `file`.
- Plan = `creates`, `updates`, `duplicates`, `invalid`. Each row: `line`, `name`, `detail`, `note`, `warnings`, hidden `attributes`, `id`, `restores`.
- Row validated with the same rules as the `<Model>Request`. Repeat of an earlier line → duplicate "repeats line N". Match on a natural key (email, tax number, lower-case name), `withTrashed()`.
- Match visibility: the match query runs on `<Model>::withTrashed()->visibleTo($actor)` and a match becomes an update only if `$actor->can('update', $match)`. A natural-key hit outside the actor's scope → `invalid` with a neutral "already exists" note, no name or detail of the hidden record.
- Mode `update_existing`: match → update only changed attributes; trashed match → restore + update. Off → duplicate, with a hint when the match is in trash. Needs the update permission.
- Unknown lookup (related record, enum value) → import without it + warning. Never invent records.

```php
public function handle(User $actor, array $data): array
{
    Gate::forUser($actor)->authorize('create', <Model>::class);
    $plan = <Model>ImportPlan::classify(<Model>Csv::rows($data['csv']), $data['update_existing']);

    if ($data['dry_run'] || $plan['creates'] === [] && $plan['updates'] === []) {
        return [...$plan, 'imported' => 0, 'updated' => 0];
    }

    DB::transaction(function () use ($actor, $plan): void {
        foreach ($plan['creates'] as $row) {
            $this->create<Model>->handle($actor, $row['attributes']);
        }
        foreach ($plan['updates'] as $row) {
            $record = <Model>::withTrashed()->findOrFail($row['id']);
            if ($row['restores']) {
                $this->restore<Model>->handle($record, $actor);
            }
            $this->update<Model>->handle($record, $actor, $row['attributes']);
        }
        activity()->causedBy($actor)->event('<models>.imported')
            ->withProperties(array_map('count', $plan))->log('<models>.imported');
    });

    return [...$plan, 'imported' => count($plan['creates']), 'updated' => count($plan['updates'])];
}
```

- Controller: `Import<Models>Request` (`file` csv/txt max 2 MB, `dry_run`, `update_existing`). Dry run → `Inertia::flash('importPreview', ImportRow::preview($plan))->back()`. Real run → toast + redirect to the list.
- Import goes through the normal Create / Update / Restore Actions → per-row audit and guards stay; one summary event on top.
- Export: `response()->streamDownload()` of `<models>-Y-m-d.csv`, UTF-8 BOM first, `fputcsv(..., escape: '')`, header labels from lang, query = the list's own filter + `visibleTo` scope, `limit(MaxRows)` (5000). Money minor units → decimal string.
- Formula guard on every text cell: `preg_match('/^[=+\-@\t\r]/', $value) ? "'".$value : $value`.
- React: `export-button` is a plain `<a href download>` built with Wayfinder from the current `filters`. `csv-import` posts with `forceFormData`, reads the preview in `onFlash`, resets it when the file or mode changes, confirm button says "Import N <models>".
- `saved-view-query.ts`: `activeView()` compares the sorted current query (minus `page`) to each view's `query` → menu shows the active view, offers Update / Delete per `can_update`, `can_delete`.

Test:
- Saved view keeps only known filters and reproduces its URL query; grouping dropped for a non-groupable layout.
- Duplicate name among visible views refused; sharing needs the stronger ability; others cannot rename or delete.
- Favorite: only what you can view, never twice, stale reorder refused, deleted view leaves favorites.
- Import dry run sorts into creates / duplicates / invalid and writes nothing.
- Semicolon + Windows-1252 file reads; trashed match skipped with hint, or restored in update mode.
- Real import creates through the Action, logs one summary; guarded without permission.
- Natural-key match on a record outside the actor's `visibleTo` → not updated, preview shows no detail of it.
- Non-CSV or > 2 MB upload → 422 on `file`; over `MaxRows` → 422, nothing written.
- Saved view from another user (personal) is not in `savedViews` and 403s on update / delete.
- Export needs the list's view permission, follows filters, starts with BOM, guards `=` cells.

Gotchas:
- List, saved views, favorites, import matching, and export all read the same `visibleTo($user)`. One scope, five callers; any second scope leaks.
- Never trust saved `filters` blindly; clean on save and the list's filter class ignores unknown keys again on read.
- Messages, enum labels (`SavedViewScope`), CSV headers go through `lang/`, not literals.
- Big files: keep the row cap; queue only if the cap is no longer enough.

Harvested: 2026-10-08 (views, favorites, import, export from source; import match scope from standard + rules)
