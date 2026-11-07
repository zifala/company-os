# SectionLayout · Company OS

Title, grouped inner nav on the left, page on the right. Setup, Organization and Settings open in it.

**One job:** Give a section with many pages one place to switch between them.
**Category:** shell · **Pieces:** 7, 26 · **Exports:** SectionLayout · **Tags:** section, settings, setup, organization, inner-nav, layout

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/section-layout.json
```

Manual: copy components/company-os/section-layout.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: nav.

## Overview

An `h1`, then a 12rem column of groups: uppercase group label, items as 32px rows, the active one `bg-primary/10 text-primary` with `aria-current="page"`. Items are filtered with `canSee`, active by longest match. Below `lg` the nav becomes one horizontal scroll row and the labels hide.

Fewer than two visible links → no nav at all, just the title and the page. The same groups gate the sidebar entry (`anyPermission: permissionsIn(groups)`) and feed the server redirect to the first permitted page.

## Examples

### Organization

Two groups, three pages. The content slot is the page.

```tsx
import { SectionLayout } from '@/components/company-os';
import { organizationNavGroups } from '@/components/section-nav-items';

export default function OrganizationLayout({ children }: PropsWithChildren) {
  const { auth } = usePage().props;

  return (
    <SectionLayout title={t('Organization')} groups={organizationNavGroups} permissions={auth.permissions}>
      {children}
    </SectionLayout>
  );
}
```

## Props

### SectionLayout

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The section name. Also the `aria-label` of the nav. |
| `groups` | `NavGroup[]` | — | Grouped items with permissions. |
| `permissions` | `string[]` | — | Granted permissions. |
| `children` | `ReactNode` | — | The page. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Through the section links, then into the page. |

- `<nav aria-label={title}>` with `aria-current="page"` on the active link.
- The content is a `<section>` after the nav in reading order.

## Don't

- No tab row for a section. Tabs split one record; this splits one area into pages.
- No page in two nav entries. One home per page.
- No nav for a single page. Under two links the nav is not rendered.

## FAQ

**Setup vs Organization?**

Setup holds what shapes the work: lists, stages, templates, automations. Organization holds people and control: users, roles, workspace, integrations.

**Landing URL?**

The sidebar links to `/setup`; a controller redirects to the first page the user may open, 403 with none.
