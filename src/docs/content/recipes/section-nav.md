# Section nav

Rule: Setup and Organization are single sidebar entries. Each opens its own area with a grouped inner sidebar. A scoped workspace (department, branch, project) swaps the main sidebar for its own. Nav is data; the same data drives the main sidebar gate, the landing redirect, and the command palette.

Shape:
- `components/section-nav-items.ts` — `setupNavGroups(t)`, `organizationNavGroups(t)`: `{label, items: GatedItem[]}[]`. `permissionsIn(groups)` gates the main sidebar entry (`anyPermission`).
- `layouts/section-layout.tsx` — `SectionLayout({title, groups})`: 15rem left nav, title, uppercase group labels, items filtered by `canSee`, active by longest match. Below `md`: one horizontal scroll row. `SetupLayout`, `OrganizationLayout` wrap it.
- `app.tsx` layout resolver — by page-name prefix: `setup/*` → `[AppLayout, SetupLayout]`, `organization/*` → `[AppLayout, OrganizationLayout]`. One place; never `Page.layout`.
- `app/Http/Controllers/SectionController.php` — `setup()`, `organization()` redirect to the first permitted page. 403 if none.
- Routes: `routes/setup.php` under `setup` prefix + name, `routes/organization.php` likewise. URL = section / group / page (`/setup/lists/sources`).
- Workspace: routes with `{<scope>}` get a shared `<scope>Navigation` prop; `AppLayout` swaps to `<Scope>Layout` (back link, code + name, flat items gated by ability and enabled module).

Code:

```ts
export type NavGroup = { label: string; items: GatedItem[] };

export function setupNavGroups(t: TFunction): NavGroup[] {
    return [
        { label: t('Lists'), items: [
            navItem(t('<Thing> types'), listItems.index('<thing>-types'), Tags, 'lists.view'),
            navItem(t('Sources'), listItems.index('sources'), Signpost, 'lists.view'),
        ] },
        { label: t('<Domain>'), items: [
            navItem(t('<Plans>'), <plans>.index(), Wallet, '<plans>.view'),
        ] },
    ];
}

export const permissionsIn = (groups: NavGroup[]): string[] =>
    groups.flatMap((group) => group.items.map((item) => item.permission).filter((p): p is string => !!p));
```

```tsx
function SectionLayout({ title, groups, children }: { title: string; groups: NavGroup[]; children: ReactNode }) {
    const { permissions } = usePage().props.auth;
    const visible = groups
        .map((group) => ({ ...group, items: group.items.filter((item) => canSee(item, permissions)) }))
        .filter((group) => group.items.length > 0);
    const activeHref = useActiveNavHref(visible.flatMap((group) => group.items));

    return (
        <div className="flex min-h-full">
            <nav aria-label={title} className="hidden w-60 shrink-0 border-r px-3 py-6 md:block">
                <h2 className="px-2 pb-4 text-lg font-bold">{title}</h2>
                {visible.map((group) => (
                    <div key={group.label} className="grid gap-0.5 pb-5">
                        <span className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">{group.label}</span>
                        {group.items.map((item) => (
                            <Link key={item.title} href={item.href} prefetch aria-current={toUrl(item.href) === activeHref ? 'page' : undefined}>
                                {item.icon && <item.icon className="size-4" />}
                                {item.title}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
```

```php
class SectionController extends Controller
{
    public const array SETUP_PAGES = [
        'lists.view' => 'list-items.index',
        '<plans>.view' => '<plans>.index',
    ];

    public function setup(Request $request): RedirectResponse
    {
        return $this->firstPermitted($request, self::SETUP_PAGES);
    }

    /** @param array<string, string> $pages */
    private function firstPermitted(Request $request, array $pages): RedirectResponse
    {
        $permission = collect(array_keys($pages))->first(fn (string $permission): bool => $request->user()->can($permission));

        abort_if($permission === null, 403);

        return to_route($pages[$permission]);
    }
}
```

Placement:
- Main sidebar, last group (unlabelled): Setup, Organization. Each one entry.
- Setup holds what shapes the work: lists, plans, templates, stages, messages, automations. Organization holds people and control: users, roles, workspace settings, integrations, activity log, system.
- Personal settings: user menu only, own layout, never in the sidebar.
- One home per page. A page is in one nav entry; a tab never repeats a nav item.
- A module with sub-pages uses the same `SectionLayout`; fewer than 2 visible links → no inner nav.
- Command palette reads the same nav data, grouped the same way. A page missing from nav is missing from the palette.

Test:
- `setup` / `organization` redirect to the first permitted page per permission (dataset); 403 with none.
- `SETUP_PAGES` matches `setupNavGroups` permissions (same set).
- Every section route 403s without its permission.

Gotchas:
- Hidden nav item still needs its route gated. React hides; Laravel forbids.
- Empty group hidden.
- `aria-label` on the `<nav>`, `aria-current="page"` on the active link.
- Inner nav scrolls on its own; content scrolls on its own.

Harvested: 2026-10-18 (grouped section layout + redirect from the first source; workspace swap, under-2-links rule, palette reuse from the second)
