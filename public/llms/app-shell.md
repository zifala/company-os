# AppShell · Company OS

Sidebar left, thin header, content below. The one layout every signed-in page renders in.

**One job:** Hold the sidebar, the header and the page in the one frame the product has.
**Category:** shell · **Pieces:** 19 · **Exports:** AppShell · **Tags:** shell, layout, sidebar, header, frame

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/app-shell.json
```

Manual: copy components/company-os/app-shell.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: app-sidebar, app-header.
shadcn primitives: sidebar.

## Overview

`SidebarProvider` around a `sidebar` slot and a `SidebarInset` that stacks the `header` over the page body (`gap-6 p-4 md:p-6`). `defaultOpen` comes from the `sidebar_state` cookie the server shares, so the sidebar does not flash open on every load.

One shell, not two. Delete the starter kit's header-only layout. Nothing sits above the page title: no breadcrumbs, no page name in the header. The sidebar says where you are.

## Examples

### The full shell

Sidebar with New and the user menu, header with search · locale · bell, a page with its header and stat row.

```tsx
import { AppHeader, AppShell, AppSidebar, AppLogo, LocaleSwitch, NavUser, NotificationBell, QuickCreate, SearchButton } from '@/components/company-os';

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth, sidebarOpen, favorites, unreadNotifications } = usePage().props;

  return (
    <AppShell
      defaultOpen={sidebarOpen}
      sidebar={
        <AppSidebar
          logo={<AppLogo icon={<Logo />} name={props.name} />}
          homeHref={dashboard()}
          groups={navGroups}
          permissions={auth.permissions}
          favorites={favorites}
          create={<QuickCreate items={createItems} />}
          footer={<NavUser user={auth.user} items={userMenu} logout={{ label: t('Log out'), href: logout(), icon: LogOut }} />}
        />
      }
      header={
        <AppHeader>
          <SearchButton onClick={() => setPalette(true)} />
          <LocaleSwitch locales={locales} current={locale} onChange={switchLocale} />
          <NotificationBell count={unreadNotifications} onOpen={loadBell} historyHref={notifications.history()} />
        </AppHeader>
      }
    >
      {children}
      <ShortcutHost />
      <AppTour … />
    </AppShell>
  );
}
```

## Props

### AppShell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sidebar` | `ReactNode` | — | An `AppSidebar`. |
| `header` | `ReactNode` | — | An `AppHeader` with its right-side controls. |
| `children` | `ReactNode` | — | The page. |
| `defaultOpen` | `boolean` | `true` | Sidebar state from the shared cookie prop. |
| `className` | `string` | — | On the provider. Demos pass `min-h-0 h-full` to fit a frame. |

## Accessibility

| Keys | Action |
| --- | --- |
| ⌘B / Ctrl+B | Toggle the sidebar (ui Sidebar default). |

- The header is a `<header>`, the sidebar a `<nav>`-bearing aside, the page a `<main>` from `SidebarInset`.
- Below `md` the sidebar becomes a Sheet opened by the header trigger.

## Don't

- No breadcrumbs, no page title in the header.
- No create button in the header. "New" sits under the logo; the page header owns "+ Create".
- No second layout for "simple" pages. Auth pages have their own; everything signed-in is this.

## FAQ

**Where do the palette, the shortcut sheet and the tour mount?**

As children of the shell in the layout, once. They render nothing visible until opened.

**Scoped workspace (department, project)?**

Swap the `sidebar` slot for the workspace sidebar when the page carries that scope. Same shell.
