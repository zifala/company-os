# Command palette

Rule: one ⌘K palette finds records, runs actions, and goes to pages; `g`-keys jump; one global "New" menu creates; everything is permission-filtered and the server decides what records show.

Shape:
- `app/Support/GlobalSearch.php` — `groups(User, string): list<{name, items: list<{id, label, url}>}>`. `MinLength = 2`, `PerGroup = 5`.
- `app/Support/TextSearch.php` — `contains(Builder, columns, term)`: `ilike` on pgsql, `like` elsewhere, wildcards escaped.
- `SearchController` (invokable) → `GET search` (`search`) → JSON `{groups}`. Same `GlobalSearch` feeds any API / MCP search.
- `resources/js/lib/commands.ts` — typed `emitCommand(name)` / `useCommand(name, handler)` over `window` CustomEvents. Keys: `palette`, `quick-create`, `help`, `<primary-create>`.
- `components/command-palette.tsx` — dialog + cmdk; `command-palette-items.ts` — `actionItems`.
- `components/go-shortcuts.ts` — `g`-keys derived from the sidebar `navGroups` (a `goKey` field on the nav item).
- `hooks/use-shortcuts.ts` — one global keydown listener; `components/shortcut-host.tsx` mounts it plus dialogs opened by command.
- `components/shortcut-help.tsx` — `?` sheet listing every key, go-keys generated.
- `components/quick-create.tsx` + `quick-create-items.ts` — the one "New" menu, top of the sidebar; items filtered by shared `can_create`.
- `components/search-dialog.tsx` — header "Search ⌘K" button that opens the palette.

Code:

```php
public static function groups(User $user, string $term): array
{
    $term = trim($term);

    if (mb_strlen($term) < self::MinLength) {
        return [];
    }

    $groups = [
        '<module>' => self::top(<Model>::query()->visibleTo($user), ['name'], $term)
            ->map(fn (<Model> $row): array => ['id' => $row->id, 'label' => $row->name, 'url' => route('<module>.show', $row)]),
        '<other>' => $user->can('<other>.view-any')
            ? self::top(<Other>::query(), ['name', 'email'], $term)
                ->map(fn (<Other> $row): array => ['id' => $row->id, 'label' => $row->name, 'url' => route('<other>.show', $row)])
            : collect(),
    ];

    return collect($groups)->filter(fn (Collection $items) => $items->isNotEmpty())
        ->map(fn (Collection $items, string $key): array => ['name' => __("search.groups.{$key}"), 'items' => $items->values()->all()])
        ->values()->all();
}

private static function top(Builder $query, array $columns, string $term): Collection
{
    return TextSearch::contains($query, $columns, $term)->latest('updated_at')->limit(self::PerGroup)->get();
}
```

```php
public static function contains(Builder $query, array $columns, string $term): Builder
{
    $operator = $query->getModel()->getConnection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
    $pattern = '%'.addcslashes(trim($term), '%_\\').'%';

    return $query->where(function (Builder $any) use ($columns, $operator, $pattern): void {
        foreach ($columns as $column) {
            $any->orWhereRaw("\"{$column}\" {$operator} ? escape '\\'", [$pattern]);
        }
    });
}
```

```ts
const singleKeys: Record<string, CommandName> = { '?': 'help', '/': 'palette', n: 'quick-create', c: '<primary-create>' };

const onKey = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        emitCommand('palette');
        return;
    }

    if (isTyping(event.target) || document.querySelector('[role="dialog"]') || event.metaKey || event.ctrlKey || event.altKey) {
        return;
    }

    const destination = goShortcuts.find((s) => s.key === key && (!s.permission || permissions.includes(s.permission)));

    if (Date.now() - awaitingGo.current < 1200 && destination) {
        awaitingGo.current = 0;
        event.preventDefault();
        router.visit(destination.url);
        return;
    }

    if (key === 'g') { awaitingGo.current = Date.now(); return; }

    const command = singleKeys[key];
    if (command) { event.preventDefault(); emitCommand(command); }
};
```

Palette behaviour:
- `useHttp` against `search()`, 200 ms debounce, only at 2+ chars. Skeleton while loading; error line on failure; empty line names the query.
- `<Command shouldFilter={false} loop>` — the server filters records; actions and go-to filter client-side by label.
- Order: record groups, then Actions, then Go to. Items show their shortcut as `<Kbd>`.
- Go to = every sidebar item the user can see (same `navGroups` + `canSee`). Never a second hand-kept list.
- Actions = create verbs (gated by `can_create` / permission) + "Show keyboard shortcuts".
- Running an item closes the palette and clears the query. Download URLs use `window.location`, pages `router.visit`.
- Header button opens it; `⌘K` / `Ctrl+K` / `/` from anywhere; `⌘K` works even while typing.
- Labels, placeholder, group names from lang.

Quick create:
- `can_create` shared from `HandleInertiaRequests` as `{<kind>: $user->can('create', <Model>::class)}`. React only reads it.
- Small records open a dialog in place; big ones visit their create page. No allowed items → the button is not rendered.
- One primary single-key create (`c`) for the record people make most; `n` opens the full menu.

Test:
- Search returns only records the user can see (scope + `view-any`); a user without the permission gets `groups: []`.
- Under 2 characters → empty groups.
- `%` and `_` in the query match literally.
- Model with a human code: exact code match ranks first, then newest `updated_at`.
- Max `PerGroup` items per group.
- `can_create` false hides the item (assert shared prop per permission).
- Guest → redirect to login; trashed records never appear in results.
- Group names come from lang: the response in `so` locale carries the `lang/so/search.php` labels.

Gotchas:
- Every search group must use the same `visibleTo` / permission as its index page. The palette is the easiest leak.
- `TextSearch` quotes column names; pass literal column lists only, never user input.
- Postgres: add `pg_trgm` GIN indexes on searched columns; skip the migration on SQLite.
- Shortcuts ignore keystrokes in inputs, textareas, selects, contenteditable, and while any dialog is open.
- Derive go-keys from a `goKey` on the nav item, never from the (translated) title.
- Keep `command-palette.tsx` under 150 lines: record list, action list, and the fetch hook as siblings.
- No search engine until `ILIKE` + trigram is measurably slow.
- Rate limit the search route (`throttle:60,1`); it is called on every keystroke.

Harvested: 2026-10-08 (palette, g-keys, quick create from source; lang-locale test, throttle from standard + rules)
