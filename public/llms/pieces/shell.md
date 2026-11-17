# Shell

Rule: one sidebar of permission-gated groups ordered daily → setup, a thin header with search + bell on the right, personal `Settings/` apart from platform `Organization/`.

Shape:
- `components/app-sidebar-items.ts` — `navGroups: {label, items: GatedItem[]}[]` + `canSee(item, permissions)`. The single nav list; palette go-to and `g`-keys read it.
- `components/app-sidebar-setup.ts` — the last group (setup-type pages + the Organization entry).
- `components/app-sidebar-organization.ts` — `organizationItems` (each with one `permission`) + `organizationPermissions`.
- `components/app-sidebar.tsx` — logo → "New" menu (header slot), groups, user menu (footer). `collapsible="icon"`.
- `components/nav-main.tsx` — one `SidebarGroup` per group; `data-tour={item.tour}` passthrough.
- `components/app-sidebar-header.tsx` — sidebar trigger left; `SearchDialog` + `NotificationBell` right. Nothing else.
- `hooks/use-active-nav-href.ts` — longest path + query match picks the one active item.
- `layouts/settings/layout.tsx`, `layouts/organization/layout.tsx` — page title + `SectionNav` (side list) + content.
- Routes: `routes/settings.php` (`settings/*`: profile, password, security, notifications, tokens); `routes/organization.php` (`organization` prefix + name: users, roles, workspace, integrations, setup).
- `Organization/OrganizationController` (invokable `organization.index`) — redirects to the first page the user may open, 403 if none.
- Shared props: `auth.permissions`, `sidebarOpen` (from the `sidebar_state` cookie).

Code:

```ts
export type GatedItem = NavItem & { permission?: string; anyPermission?: string[]; tour?: string; goKey?: string };

export const navGroups: { label: string; items: GatedItem[] }[] = [
    { label: 'nav.daily', items: [
        { title: 'nav.home', href: dashboard(), icon: House, goKey: 'h' },
        { title: 'nav.inbox', href: inbox(), icon: Inbox, goKey: 'i' },
    ] },
    { label: 'nav.<area>', items: [
        { title: 'nav.<module>', href: <module>.index(), icon: <Icon>, permission: '<module>.view-any', goKey: '<k>' },
    ] },
    { label: 'nav.setup', items: setupItems },
];

export const canSee = (item: GatedItem, granted: string[]): boolean =>
    (!item.permission || granted.includes(item.permission)) &&
    (!item.anyPermission || item.anyPermission.some((p) => granted.includes(p)));
```

```tsx
const groups = navGroups
    .map((group) => ({ label: group.label, items: group.items.filter((item) => canSee(item, auth.permissions)) }))
    .filter((group) => group.items.length > 0);
```

```php
class OrganizationController extends Controller
{
    private const array PagesByPermission = [
        'users.view-any' => 'organization.users.index',
        'roles.manage' => 'organization.roles.index',
        'settings.manage' => 'organization.workspace.edit',
    ];

    public function __invoke(Request $request): RedirectResponse
    {
        $permission = collect(array_keys(self::PagesByPermission))
            ->first(fn (string $permission): bool => $request->user()->can($permission));

        abort_if($permission === null, 403);

        return to_route(self::PagesByPermission[$permission]);
    }
}
```

```ts
const matchScore = (href: string, current: URL): number => {
    const target = new URL(href, base);
    const path = target.pathname.replace(/\/$/, '');
    const onPath = current.pathname === target.pathname || current.pathname.startsWith(`${path}/`);
    const onQuery = [...target.searchParams].every(([k, v]) => current.searchParams.get(k) === v);

    return onPath && onQuery ? path.length * 100 + [...target.searchParams].length : -1;
};
```

Placement:
- Group order: daily work → records → work → money → insight → setup. Rename per product; keep daily first, setup last.
- Setup group: config-type pages (templates, automations, trash) then one "Organization" item gated by `anyPermission: organizationPermissions`.
- "New" sits at the top of the sidebar, under the logo. No create button in the header.
- Page header owns its own "+ Create". Nothing above the title.
- Personal `Settings/`: only the user's own things. Reached from the user menu, never the sidebar.
- `Organization/`: users, roles, workspace settings, integrations, setup. Reached from the sidebar.
- User menu: profile/settings, "Take the tour", log out.

Test:
- `organization.index` redirects to the first permitted page per permission (dataset); 403 with none.
- Every Organization route 403s without its permission (each page has its own gate; the sidebar is only a hint).
- Each layout's pages render (page render dataset with expected component names).
- Shared `auth.permissions` holds exactly the user's permissions (all for super admin, none for a bare user); the sidebar reads only this.
- `settings/*` routes open for any signed-in user and touch only the current user; no `settings/*` route takes another user's id.

Gotchas:
- React hides; Laravel forbids. A hidden sidebar item still needs a policy or gate on its route.
- Keep `PagesByPermission` and `organizationItems` in the same order and set — a test over both catches drift.
- Empty group hidden, not shown with a label and no items.
- Share `sidebarOpen` from the cookie and pass it as `defaultOpen`, or the sidebar flashes open on every load.
- Active item by longest match, so `/<module>/123` lights `<module>` and not home.
- Labels are lang keys, translated at render. Never English literals in the nav list.
- Delete the starter kit's unused header-only layout; one shell, not two.
- No breadcrumbs anywhere: drop the starter kit's `breadcrumbs` prop and header slot. The active sidebar item says where you are.
- Header holds nothing else: no page title, no create button, no theme toggle.
- Favorites (pinned records) sit above the groups when the views piece is installed.

Harvested: 2026-10-08 (sidebar, header, Organization redirect from source; no-breadcrumbs, shared-permission test from standard + rules)
