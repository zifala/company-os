# Page kit

Rule: every page is built from the same small parts; Laravel sends ready rows, the page shell renders at once, the main data arrives deferred with a skeleton and a retry.

Shape (`resources/js/components/`, each one job, skin from the project's ui primitives):
- `page-header.tsx` — `title`, `meta?`, `children` (the page's own "+ Create" and export). Nothing above the title.
- `filter-chips.tsx` — types `FilterField`, `FilterState`; `applyFilters()`, `activeFilters()`; chips with remove + "Clear filters".
- `filter-control.tsx` — one field → text input, plain dropdown (≤ ~7 options), or searchable combobox. Never a native `<select>`.
- `cells.tsx` — typed cells, one per data kind (see below). Every table cell is one of them, never a bare `<span>`.
- `filter-bar.tsx` — search (Enter applies), inline fields, overflow fields in a popover with an active count, `end` slot (views menu, export), chips under.
- `data-table.tsx` — `DataTable` (empty switch + pager footer), `TableEmpty` (filtered-empty vs truly empty), `DataTableSkeleton`.
- `empty-state.tsx` — `icon`, `title`, `message`, `children` (the first action).
- `tab-nav.tsx` — `tabs: {label, href, count?}[]`, `label` for `aria-label`; active from current URL; each tab is a route.
- `actions-menu.tsx` — row "…" menu: `items: {label, onSelect, destructive?}[]`.
- `reason-dialog.tsx` / `confirm-dialog.tsx` — see recipe `status-dialog`.
- `activity-timeline.tsx` — entries grouped by server `day_label`; empty state when none.
- `stat-tile.tsx` — `label`, `value`, `unit?`, `hint?`. Value tabular and bold, unit soft.
- `list-skeleton.tsx` — `rows` placeholder bars for non-table lists.
- `load-error.tsx` — `prop`, `noun`; message + "Load <noun> again" → `router.reload({ only: [prop] })`.

Code:

```php
$user = $request->user();
$filters = $request->only(<Model>Filters::Keys);

return Inertia::render('<module>/index', [
    'filters' => $filters,
    '<models>' => Inertia::defer(fn () => <Model>Resource::collection(
        <Model>Filters::apply(<Model>::query()->visibleTo($user), $filters)->paginate(25)->withQueryString())),
    'lookups' => ['statuses' => <Model>Status::options()],
    'can' => ['create' => $user->can('create', <Model>::class)],
]);
```

```tsx
<PageHeader title={t.title}>{can.create && <Create<Model>Dialog />}</PageHeader>
<FilterBar state={state} end={<ExportButton href={<models>Routes.export.url({ query: filters })} />} />
<Deferred data="<models>" fallback={<DataTableSkeleton />} rescue={<LoadError prop="<models>" noun={t.noun} />}>
    <DataTable
        isEmpty={(<models>?.data ?? []).length === 0}
        page={<models>}
        empty={<TableEmpty state={state} icon={<Icon>} noun={t.noun} title={t.emptyTitle} message={t.emptyMessage} />}
    >
        <<Model>Table rows={<models>?.data ?? []} />
    </DataTable>
</Deferred>
```

```tsx
export function applyFilters({ url, filters }: Pick<FilterState, 'url' | 'filters'>, changes: Record<string, string>) {
    const query = Object.fromEntries(Object.entries({ ...filters, ...changes }).filter(([, value]) => value !== ''));

    router.get(url, query, { preserveState: true, preserveScroll: true, replace: true });
}
```

```tsx
export function TableEmpty({ state, icon, noun, title, message }: TableEmptyProps) {
    if (state && activeFilters(state).length > 0) {
        return (
            <EmptyState icon={icon} title={t.noMatch(noun)} message={t.filtersHideAll}>
                <FilterChips state={state} />
            </EmptyState>
        );
    }

    return <EmptyState icon={icon} title={title} message={message} />;
}
```

- `FilterState` = `{ url, filters, fields, searchPlaceholder? }`. `FilterField` = `{ key, label, options?, placeholder?, defaultValue?, inline?, searchable?, text? }`. A value equal to `defaultValue` is not a chip.
- Filters live in the query string; empty values are dropped so URLs stay short and saved views compare cleanly.
```tsx
export type Money = { formatted: string; currency: string } | null;
export type Day = { label: string; relative: string } | null;
export type Status = { label: string; tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' };

const Empty = () => <span className="text-muted-foreground">—</span>;

export const MoneyCell = ({ value }: { value: Money }) =>
    value ? <TableCell className="text-right tabular-nums">{value.currency} <b>{value.formatted}</b></TableCell> : <TableCell className="text-right"><Empty /></TableCell>;

export const DateCell = ({ value }: { value: Day }) =>
    <TableCell>{value ? <span title={value.relative}>{value.label}</span> : <Empty />}</TableCell>;
```

| Cell | Shape from server | Renders |
| --- | --- | --- |
| `MoneyCell`, `NumberCell`, `PercentCell` | `formatted` + unit | right-aligned, tabular, unit shown |
| `DateCell` | `label`, `relative` | label; relative in tooltip |
| `StatusCell` | enum `label`, `tone` | pill with tone dot |
| `PersonCell` | `name`, `avatar_url`, `initials` | avatar + name |
| `CodeCell` | `code` | mono, muted |
| `BooleanCell` | `value`, `label` | dot + word |
| `LinkCell` | `label`, `href` | primary column, bold `<Link>` |
| any, `null` | — | muted `—` |

- Laravel formats every value (money, dates, enum labels from lang); cells never format, sort, or translate. Header `<TableHead>` takes the same alignment as its cells.
- Pager footer reads Laravel's paginator (`from`, `to`, `total`, `prev_page_url`, `next_page_url`).
- Secondary panels (activity, related lists) → `Inertia::optional()` + `<WhenVisible>` with `ListSkeleton`.
- Page over 150 lines → page folder: `pages/<module>/index.tsx` + `pages/<module>/index/<Model>Table.tsx`, `types.ts`.

Test:
- Feature: index without filters returns the shell props; `<models>` absent until the deferred request; deferred reload returns rows only the user may see.
- Filter keys in the query narrow the rows; unknown keys ignored.
- `can.create` false → no create button prop for a viewer.
- Index without the module's `view-any` → 403; deferred partial reload is guarded the same.
- Resource rows send formatted values (`formatted`, `label`, `tone`); assert one money and one date cell shape.
- Front end is covered by types (`tsc`) and the feature tests above; no snapshot tests.

Gotchas:
- Every data region shows four states: loading (skeleton), empty (names the first action), error (`LoadError` with retry), loaded.
- `TableEmpty` must tell "no records yet" apart from "filters hide everything", or users think data is gone. First-use empty names the first action and carries its button when `can.create`; without it, the message says who can add one.
- `<Deferred>` needs `rescue`; without it a failed deferred request leaves the skeleton forever.
- `DropdownMenu modal={false}` on row menus so a dialog opened from an item keeps focus right.
- Labels, placeholders, option lists and empty copy come from the server or lang, not literals in the page.
- No palette colors in this recipe on purpose: only alignment and theme tokens (`text-muted-foreground`). Each project skins the kit from its own ui primitives.
- Build the shared cell set before the first table; module-specific cells drift.

Harvested: 2026-10-08 (header, filters, table, empty, tabs, menus, timeline, tile, skeleton, load-error from source; typed cell set from standard + ui-design rules)
