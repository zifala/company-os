import type { DocEntry } from '../types';

export const appSidebar: DocEntry = {
    slug: 'app-sidebar',
    name: 'AppSidebar',
    category: 'shell',
    pieces: [19],
    tagline: 'Logo, New, favorites, permission-gated groups, user menu. Collapses to icons.',
    job: 'Put every page one click away, in the order people work.',
    tags: ['sidebar', 'navigation', 'groups', 'favorites', 'user-menu', 'logo'],
    exports: ['AppSidebar', 'AppLogo', 'NavMain', 'NavFavorites', 'NavUser', 'UserInfo', 'initialsOf', 'Favorite', 'UserMenuItem', 'UserSummary'],
    files: [
        'components/company-os/app-sidebar.tsx',
        'components/company-os/nav-main.tsx',
        'components/company-os/nav-user.tsx',
        'components/company-os/user-info.tsx',
        'hooks/use-mobile.ts',
    ],
    registryDeps: ['nav'],
    shadcnDeps: ['sidebar', 'dropdown-menu', 'avatar'],
    intro: [
        'Top to bottom: <b>AppLogo</b> linking home, the <code>create</code> slot (a <code>QuickCreate</code>), <b>NavFavorites</b> when the user pinned records, one <b>NavMain</b> group per visible nav group, and the <code>footer</code> slot holding <b>NavUser</b>. Groups come from <code>visibleGroups(groups, permissions)</code>; the active item from <code>useActiveNavHref</code> over favorites and items together.',
        'Active is <code>bg-primary/10 text-primary</code> from the ui Sidebar, never a left border. <code>NavUser</code> opens a menu with the user\'s name and email, the items you pass (Settings, Take the tour, Organization when permitted) and the logout entry. The sidebar carries <code>data-tour="sidebar"</code>; each item renders its <code>tour</code> key.',
    ],
    examples: [
        {
            title: 'Sidebar with favorites',
            description: 'Rendered with <code>collapsible="none"</code> so it fits the frame; in the app it is <code>icon</code>.',
            demoKey: 'app-sidebar',
            code: `import { AppLogo, AppSidebar, NavUser, QuickCreate } from '@/components/company-os';

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
/>`,
        },
    ],
    props: [
        {
            component: 'AppSidebar',
            rows: [
                { name: 'logo', type: 'ReactNode', description: 'Usually <code>AppLogo</code>.' },
                { name: 'homeHref', type: 'Href', description: 'Where the logo goes.' },
                { name: 'groups', type: 'NavGroup[]', description: 'The nav list.' },
                { name: 'permissions', type: 'string[]', description: 'Granted permissions.' },
                { name: 'favorites', type: 'Favorite[]', defaultValue: '[]', description: '<code>{ id, title, href, icon? }</code>. Shown above the groups.' },
                { name: 'create', type: 'ReactNode', description: 'The New menu, under the logo.' },
                { name: 'footer', type: 'ReactNode', description: 'The user menu.' },
                { name: 'collapsible', type: "'icon' | 'offcanvas' | 'none'", defaultValue: "'icon'", description: 'ui Sidebar mode.' },
                { name: 'variant', type: "'inset' | 'sidebar' | 'floating'", defaultValue: "'inset'", description: 'ui Sidebar variant.' },
            ],
        },
        {
            component: 'NavUser',
            rows: [
                { name: 'user', type: 'UserSummary', description: '<code>{ name, email?, avatar? }</code>. Initials from the name when no avatar.' },
                { name: 'items', type: 'UserMenuItem[]', description: '<code>{ label, icon?, href?, onSelect? }</code>. Href renders a link; otherwise a menu action.' },
                { name: 'logout', type: 'UserMenuItem', description: 'Separated at the bottom.' },
            ],
        },
        {
            component: 'AppLogo',
            rows: [
                { name: 'icon', type: 'ReactNode', description: 'The mark, in <code>text-primary</code>.' },
                { name: 'name', type: 'string', description: 'The product name, bold slate.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Tab', action: 'Logo, New, each item, user menu.' },
            { keys: 'Enter', action: 'Open the focused page or menu.' },
        ],
        notes: [
            'Collapsed to icons, each item shows its title as a tooltip and keeps it as the accessible name.',
            'The user menu is a Radix dropdown: arrow keys move, Esc closes.',
        ],
    },
    donts: [
        'No left border on the active item. The tint is the state.',
        'No personal settings in the groups. User menu only.',
        'No create button here except the one New menu.',
        'No group label without items.',
    ],
    faq: [
        { q: 'Where does Organization live?', a: 'One entry in the last group gated by <code>anyPermission: permissionsIn(organizationNavGroups)</code>. It opens a SectionLayout.' },
        { q: 'Favorites reorder?', a: 'The page owns favorites. Drag-to-reorder posts <code>favorites.reorder</code> from the page; the sidebar only lists them.' },
    ],
};
