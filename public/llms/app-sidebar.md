# AppSidebar · Company OS

Logo, New, favorites, permission-gated groups, user menu. Collapses to icons.

**One job:** Put every page one click away, in the order people work.
**Category:** shell · **Pieces:** 19 · **Exports:** AppSidebar, AppLogo, NavMain, NavFavorites, NavUser, UserInfo, initialsOf, Favorite, UserMenuItem, UserSummary · **Tags:** sidebar, navigation, groups, favorites, user-menu, logo

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/app-sidebar.json
```

Manual: copy components/company-os/app-sidebar.tsx, components/company-os/nav-main.tsx, components/company-os/nav-user.tsx, components/company-os/user-info.tsx, hooks/use-mobile.ts into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: nav.
shadcn primitives: sidebar, dropdown-menu, avatar.

## Overview

Top to bottom: **AppLogo** linking home, the `create` slot (a `QuickCreate`), **NavFavorites** when the user pinned records, one **NavMain** group per visible nav group, and the `footer` slot holding **NavUser**. Groups come from `visibleGroups(groups, permissions)`; the active item from `useActiveNavHref` over favorites and items together.

Active is `bg-primary/10 text-primary` from the ui Sidebar, never a left border. `NavUser` opens a menu with the user's name and email, the items you pass (Settings, Take the tour, Organization when permitted) and the logout entry. The sidebar carries `data-tour="sidebar"`; each item renders its `tour` key.

## Examples

### Sidebar with favorites

Rendered with `collapsible="none"` so it fits the frame; in the app it is `icon`.

```tsx
import { AppLogo, AppSidebar, NavUser, QuickCreate } from '@/components/company-os';

<AppSidebar
  logo={<AppLogo icon={<Logo className="size-6" />} name="Northwind" />}
  homeHref={dashboard()}
  groups={navGroups}
  permissions={auth.permissions}
  favorites={favorites}
  create={<QuickCreate items={createItems} />}
  footer={
    <NavUser
      user={auth.user}
      items={[
        { label: t('Settings'), icon: Settings, href: profile.edit() },
        { label: t('Take the tour'), icon: Compass, href: dashboard({ query: { tour: 1 } }) },
      ]}
      logout={{ label: t('Log out'), icon: LogOut, href: logout() }}
    />
  }
/>
```

## Props

### AppSidebar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `ReactNode` | — | Usually `AppLogo`. |
| `homeHref` | `Href` | — | Where the logo goes. |
| `groups` | `NavGroup[]` | — | The nav list. |
| `permissions` | `string[]` | — | Granted permissions. |
| `favorites` | `Favorite[]` | `[]` | `{ id, title, href, icon? }`. Shown above the groups. |
| `create` | `ReactNode` | — | The New menu, under the logo. |
| `footer` | `ReactNode` | — | The user menu. |
| `collapsible` | `'icon' | 'offcanvas' | 'none'` | `'icon'` | ui Sidebar mode. |
| `variant` | `'inset' | 'sidebar' | 'floating'` | `'inset'` | ui Sidebar variant. |

### NavUser

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `UserSummary` | — | `{ name, email?, avatar? }`. Initials from the name when no avatar. |
| `items` | `UserMenuItem[]` | — | `{ label, icon?, href?, onSelect? }`. Href renders a link; otherwise a menu action. |
| `logout` | `UserMenuItem` | — | Separated at the bottom. |

### AppLogo

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | — | The mark, in `text-primary`. |
| `name` | `string` | — | The product name, bold slate. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Logo, New, each item, user menu. |
| Enter | Open the focused page or menu. |

- Collapsed to icons, each item shows its title as a tooltip and keeps it as the accessible name.
- The user menu is a Radix dropdown: arrow keys move, Esc closes.

## Don't

- No left border on the active item. The tint is the state.
- No personal settings in the groups. User menu only.
- No create button here except the one New menu.
- No group label without items.

## FAQ

**Where does Organization live?**

One entry in the last group gated by `anyPermission: permissionsIn(organizationNavGroups)`. It opens a SectionLayout.

**Favorites reorder?**

The page owns favorites. Drag-to-reorder posts `favorites.reorder` from the page; the sidebar only lists them.
