import type { DocEntry } from '../types';

export const sectionLayout: DocEntry = {
    slug: 'section-layout',
    name: 'SectionLayout',
    category: 'shell',
    pieces: [7, 26],
    tagline: 'Title, grouped inner nav on the left, page on the right. Setup, Organization and Settings open in it.',
    job: 'Give a section with many pages one place to switch between them.',
    tags: ['section', 'settings', 'setup', 'organization', 'inner-nav', 'layout'],
    exports: ['SectionLayout'],
    files: ['components/company-os/section-layout.tsx'],
    registryDeps: ['nav'],
    intro: [
        'An <code>h1</code>, then a 12rem column of groups: uppercase group label, items as 32px rows, the active one <code>bg-primary/10 text-primary</code> with <code>aria-current="page"</code>. Items are filtered with <code>canSee</code>, active by longest match. Below <code>lg</code> the nav becomes one horizontal scroll row and the labels hide.',
        'Fewer than two visible links → no nav at all, just the title and the page. The same groups gate the sidebar entry (<code>anyPermission: permissionsIn(groups)</code>) and feed the server redirect to the first permitted page.',
    ],
    examples: [
        {
            title: 'Organization',
            description: 'Two groups, three pages. The content slot is the page.',
            demoKey: 'section-layout',
            code: `import { SectionLayout } from '@/components/company-os';
import { organizationNavGroups } from '@/components/section-nav-items';

export default function OrganizationLayout({ children }: PropsWithChildren) {
  const { auth } = usePage().props;

  return (
    <SectionLayout title={t('Organization')} groups={organizationNavGroups} permissions={auth.permissions}>
      {children}
    </SectionLayout>
  );
}`,
        },
    ],
    props: [
        {
            component: 'SectionLayout',
            rows: [
                { name: 'title', type: 'string', description: 'The section name. Also the <code>aria-label</code> of the nav.' },
                { name: 'groups', type: 'NavGroup[]', description: 'Grouped items with permissions.' },
                { name: 'permissions', type: 'string[]', description: 'Granted permissions.' },
                { name: 'children', type: 'ReactNode', description: 'The page.' },
            ],
        },
    ],
    a11y: {
        keyboard: [{ keys: 'Tab', action: 'Through the section links, then into the page.' }],
        notes: [
            '<code>&lt;nav aria-label={title}&gt;</code> with <code>aria-current="page"</code> on the active link.',
            'The content is a <code>&lt;section&gt;</code> after the nav in reading order.',
        ],
    },
    donts: [
        'No tab row for a section. Tabs split one record; this splits one area into pages.',
        'No page in two nav entries. One home per page.',
        'No nav for a single page. Under two links the nav is not rendered.',
    ],
    faq: [
        { q: 'Setup vs Organization?', a: 'Setup holds what shapes the work: lists, stages, templates, automations. Organization holds people and control: users, roles, workspace, integrations.' },
        { q: 'Landing URL?', a: 'The sidebar links to <code>/setup</code>; a controller redirects to the first page the user may open, 403 with none.' },
    ],
};
