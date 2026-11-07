# AppHeader · Company OS

A thin bar: sidebar trigger left, then trigger · search · locale · bell. Nothing else.

**One job:** Hold the three global controls without stealing the page title.
**Category:** shell · **Pieces:** 19 · **Exports:** AppHeader, SearchButton · **Tags:** header, search, bell, locale, trigger

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/app-header.json
```

Manual: copy components/company-os/app-header.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, kbd, sidebar.

## Overview

64px tall, 48px when the sidebar is collapsed, a faint bottom border. The `SidebarTrigger` sits left; children align right in this order: **SearchButton**, **LocaleSwitch**, **NotificationBell**. `SearchButton` is the outlined "Search ⌘K" field-lookalike that opens the palette; it carries `data-tour="search"`.

No page title, no breadcrumbs, no create button, no theme toggle. The page header below owns the title and its actions.

## Examples

### Search · locale · bell

```tsx
import { AppHeader, LocaleSwitch, NotificationBell, SearchButton } from '@/components/company-os';

<AppHeader>
  <SearchButton onClick={() => setPalette(true)} label={t('Search')} />
  <LocaleSwitch locales={locales} current={locale} onChange={(value) => router.post(localeRoute.update(), { locale: value })} />
  <NotificationBell count={unreadNotifications} onOpen={loadBell} historyHref={notifications.history()} />
</AppHeader>
```

## Props

### AppHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Right-aligned controls, in the order search · locale · bell. |

### SearchButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onClick` | `() => void` | — | Opens the palette. |
| `label` | `string` | `'Search'` | Button text. |
| `shortcut` | `string` | `'⌘K'` | Shown as a Kbd on the right. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Trigger, search, locale, bell. |
| ⌘B | Toggle the sidebar. |

- A landmark `<header>`. The trigger has its own screen-reader label from the ui Sidebar.
- SearchButton is a real button; the Kbd is decorative text.

## Don't

- No page title or breadcrumbs here.
- No create button. New lives in the sidebar, Create in the page header.
- No fourth control. If a product needs one, it goes in the user menu.

## FAQ

**Mobile?**

The trigger opens the sidebar as a sheet; the search button shrinks with the row. The bell stays.
