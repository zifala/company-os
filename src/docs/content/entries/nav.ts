import type { DocEntry } from '../types';

export const nav: DocEntry = {
    slug: 'nav',
    name: 'Nav',
    category: 'shell',
    pieces: [4, 19],
    tagline: 'The nav list as data. One array of gated groups drives the sidebar, the section nav, the palette and the g-keys.',
    job: 'Declare every page once, with its permission, icon, tour key and go-key.',
    tags: ['nav', 'navigation', 'permissions', 'gating', 'active', 'shortcuts'],
    exports: ['canSee', 'visibleGroups', 'permissionsIn', 'goShortcuts', 'useActiveNavHref', 'NavItem', 'GatedItem', 'NavGroup', 'GoShortcut'],
    files: ['components/company-os/nav.ts', 'components/company-os/use-active-nav-href.ts'],
    intro: [
        'A <code>NavGroup</code> is <code>{ label?, items: GatedItem[] }</code>. A <code>GatedItem</code> is <code>{ title, href, icon?, tour?, goKey?, permission?, anyPermission? }</code>. <b>canSee</b> checks one item against the granted list; <b>visibleGroups</b> filters a whole list and drops empty groups; <b>permissionsIn</b> collects the permissions of a section so its sidebar entry can use <code>anyPermission</code>; <b>goShortcuts</b> turns <code>goKey</code>s into <code>G X</code> jumps.',
        '<b>useActiveNavHref</b> picks the one active item by longest path match plus query match, so <code>/invoices/42</code> lights Invoices, and <code>?view=mine</code> beats the plain index. React hides; Laravel forbids. A hidden item still needs its route gated.',
    ],
    examples: [
        {
            title: 'Same list, two roles',
            description: 'The member lacks deals, invoices and the Manage permissions. Empty groups disappear.',
            demoKey: 'nav-gating',
            code: `import type { NavGroup } from '@/components/company-os';
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
const jumps = goShortcuts(navGroups, auth.permissions);`,
        },
    ],
    props: [
        {
            component: 'GatedItem',
            rows: [
                { name: 'title', type: 'string', description: 'Translated at render. Never a lang key shown raw.' },
                { name: 'href', type: 'Href', description: 'A URL string or a Wayfinder <code>{ url }</code>.' },
                { name: 'icon', type: 'LucideIcon', description: 'Sidebar and palette icon.' },
                { name: 'permission', type: 'string', description: 'Required permission. Omit for pages every user may open.' },
                { name: 'anyPermission', type: 'string[]', description: 'Visible when the user holds at least one. For section entries.' },
                { name: 'goKey', type: 'string', description: 'Letter after <code>g</code>. Declared here, never derived from the title.' },
                { name: 'tour', type: 'string', description: 'Rendered as <code>data-tour</code> on the sidebar item.' },
            ],
        },
        {
            component: 'useActiveNavHref',
            rows: [
                { name: 'hrefs', type: 'string[]', description: 'Candidate URLs. Returns the best match for the current URL or null.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'Pure data and one hook. The components that render it set <code>aria-current="page"</code> on the active link.',
        ],
    },
    donts: [
        'No second list for the palette or the shortcut sheet. Both read this one.',
        'No English literals in the list. Titles and labels are translated.',
        'No label-only group. A group with no visible items is not rendered.',
        'No gating decided by the sidebar alone. Every route has its own policy.',
    ],
    faq: [
        { q: 'Group order?', a: 'Daily work → records → work → money → insight → setup. Rename per product; keep daily first and setup last.' },
        { q: 'Personal settings?', a: 'Not in the nav. Reached from the user menu only.' },
    ],
};
