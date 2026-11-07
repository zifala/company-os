# Nav · Company OS

The nav list as data. One array of gated groups drives the sidebar, the section nav, the palette and the g-keys.

**One job:** Declare every page once, with its permission, icon, tour key and go-key.
**Category:** shell · **Pieces:** 4, 19 · **Exports:** canSee, visibleGroups, permissionsIn, goShortcuts, useActiveNavHref, NavItem, GatedItem, NavGroup, GoShortcut · **Tags:** nav, navigation, permissions, gating, active, shortcuts

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/nav.json
```

Manual: copy components/company-os/nav.ts, components/company-os/use-active-nav-href.ts into your project (plus lib/navigation.tsx and the token set).

## Overview

A `NavGroup` is `{ label?, items: GatedItem[] }`. A `GatedItem` is `{ title, href, icon?, tour?, goKey?, permission?, anyPermission? }`. **canSee** checks one item against the granted list; **visibleGroups** filters a whole list and drops empty groups; **permissionsIn** collects the permissions of a section so its sidebar entry can use `anyPermission`; **goShortcuts** turns `goKey`s into `G X` jumps.

**useActiveNavHref** picks the one active item by longest path match plus query match, so `/invoices/42` lights Invoices, and `?view=mine` beats the plain index. React hides; Laravel forbids. A hidden item still needs its route gated.

## Examples

### Same list, two roles

The member lacks deals, invoices and the Manage permissions. Empty groups disappear.

```tsx
import type { NavGroup } from '@/components/company-os';
import { visibleGroups, goShortcuts, permissionsIn } from '@/components/company-os';

export const navGroups: NavGroup[] = [
  { label: t('nav.daily'), items: [
    { title: t('nav.home'), href: dashboard(), icon: House, goKey: 'h' },
    { title: t('nav.inbox'), href: inbox(), icon: Inbox, goKey: 'i' },
  ] },
  { label: t('nav.clients'), items: [
    { title: t('nav.contacts'), href: contacts.index(), icon: Contact, permission: 'contacts.view-any', goKey: 'c' },
  ] },
  { label: t('nav.manage'), items: [
    { title: t('nav.organization'), href: organization.index(), icon: Network, anyPermission: permissionsIn(organizationNavGroups) },
  ] },
];

const visible = visibleGroups(navGroups, auth.permissions);
const jumps = goShortcuts(navGroups, auth.permissions);
```

## Props

### GatedItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Translated at render. Never a lang key shown raw. |
| `href` | `Href` | — | A URL string or a Wayfinder `{ url }`. |
| `icon` | `LucideIcon` | — | Sidebar and palette icon. |
| `permission` | `string` | — | Required permission. Omit for pages every user may open. |
| `anyPermission` | `string[]` | — | Visible when the user holds at least one. For section entries. |
| `goKey` | `string` | — | Letter after `g`. Declared here, never derived from the title. |
| `tour` | `string` | — | Rendered as `data-tour` on the sidebar item. |

### useActiveNavHref

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hrefs` | `string[]` | — | Candidate URLs. Returns the best match for the current URL or null. |

## Accessibility

- Pure data and one hook. The components that render it set `aria-current="page"` on the active link.

## Don't

- No second list for the palette or the shortcut sheet. Both read this one.
- No English literals in the list. Titles and labels are translated.
- No label-only group. A group with no visible items is not rendered.
- No gating decided by the sidebar alone. Every route has its own policy.

## FAQ

**Group order?**

Daily work → records → work → money → insight → setup. Rename per product; keep daily first and setup last.

**Personal settings?**

Not in the nav. Reached from the user menu only.
