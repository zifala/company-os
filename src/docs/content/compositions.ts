export type CompositionKind = 'block' | 'template';

export interface Composition {
    slug: string;
    kind: CompositionKind;
    name: string;
    tagline: string;
    description: string[];
    tags: string[];
    pieces: number[];
    files: string[];
    deps: string[];
}

export const blocks: Composition[] = [
    {
        slug: 'index-page',
        kind: 'block',
        name: 'Index page',
        tagline: 'PageHeader with its create action, FilterBar with export, one DataTable of typed cells, the pager.',
        description: ['The index page every module gets. Every filterable column has a field, the query string is the state, rows open the record from the primary column, the footer counts.'],
        tags: ['index', 'list', 'table', 'filters'],
        pieces: [20, 15],
        files: ['blocks/index-page.tsx'],
        deps: ['page-header', 'filter-bar', 'data-table', 'cells', 'export-button'],
    },
    {
        slug: 'record-page',
        kind: 'block',
        name: 'Record page',
        tagline: 'Header actions, tabs that are routes, detail cards main-left and fixed-right, activity.',
        description: ['The show page: status pill in the header, favorite star, outline secondary action, the "…" menu for the serious ones. Tabs per section. DetailCards with the onboarding card on the right.'],
        tags: ['record', 'show', 'detail', 'tabs', 'activity'],
        pieces: [20, 2, 27],
        files: ['blocks/record-page.tsx'],
        deps: ['page-header', 'pill', 'tab-nav', 'actions-menu', 'favorite-button', 'detail-card', 'onboarding-card', 'activity-timeline'],
    },
    {
        slug: 'form-page',
        kind: 'block',
        name: 'Full-page form',
        tagline: 'Sticky header with Cancel and Create, section cards left, fixed-field cards right.',
        description: ['More than five fields means a page. Sections named by one title each; relationship, source and finance in small side cards; the phone through the shared PhoneField; a server error shown under its field.'],
        tags: ['form', 'create', 'edit', 'sections'],
        pieces: [20],
        files: ['blocks/form-page.tsx'],
        deps: ['form-layout', 'field-row', 'phone-field'],
    },
    {
        slug: 'home-dashboard',
        kind: 'block',
        name: 'Home',
        tagline: 'Raised stat tiles, the work waiting on you as a table, latest activity.',
        description: ['Never a setup checklist, never a bare list. Numbers that link to their lists, one table of what waits, the feed with subjects.'],
        tags: ['home', 'dashboard', 'stats', 'activity'],
        pieces: [20, 11],
        files: ['blocks/home-dashboard.tsx'],
        deps: ['page-header', 'stat-tile', 'data-table', 'cells', 'activity-timeline'],
    },
];

export const templates: Composition[] = [
    {
        slug: 'users-page',
        kind: 'template',
        name: 'Organization · Users',
        tagline: 'The people list inside the Organization section: invite in a dialog, deactivate with a reason.',
        description: ['SectionLayout with the People and System groups. Name over email in one cell, role and status pills, last login as a date. Invite is a five-field FormDialog; deactivate is a ReasonDialog with a successor on the real page.'],
        tags: ['users', 'organization', 'people', 'invite', 'deactivate'],
        pieces: [6, 26, 16],
        files: ['templates/users-page.tsx', 'templates/organization-nav.ts'],
        deps: ['section-layout', 'page-header', 'data-table', 'cells', 'actions-menu', 'form-dialog', 'reason-dialog', 'field-row'],
    },
    {
        slug: 'trash-page',
        kind: 'template',
        name: 'Trash',
        tagline: 'What was deleted, by whom, why, and how many days remain. Restore through a confirm.',
        description: ['One table across types with a type filter. Who and the reason stack in one cell; days left is a number; Restore is a ConfirmDialog that says nothing re-sends.'],
        tags: ['trash', 'restore', 'soft delete'],
        pieces: [14, 16],
        files: ['templates/trash-page.tsx'],
        deps: ['page-header', 'filter-bar', 'data-table', 'cells', 'confirm-dialog'],
    },
    {
        slug: 'setup-page',
        kind: 'template',
        name: 'Organization · Setup',
        tagline: 'The checklist that ticks from real data, the services panel, and Finish setup.',
        description: ['Steps with one button per link. Review-only steps never tick. Services show ok or missing with the env names, never values.'],
        tags: ['setup', 'checklist', 'services'],
        pieces: [8, 7, 26],
        files: ['templates/setup-page.tsx', 'templates/organization-nav.ts'],
        deps: ['section-layout', 'page-header', 'setup-checklist'],
    },
    {
        slug: 'settings-page',
        kind: 'template',
        name: 'Settings · Profile',
        tagline: 'The personal settings layout: profile, timezone and quiet hours, nothing platform-wide.',
        description: ['Reached from the user menu, never the sidebar. Flat side nav of the user\'s own pages. Timezone and quiet hours live here because notifications read them per user.'],
        tags: ['settings', 'profile', 'timezone', 'quiet hours'],
        pieces: [7, 18],
        files: ['templates/settings-page.tsx'],
        deps: ['section-layout', 'page-header', 'form-layout', 'field-row', 'phone-field'],
    },
];

export const compositions: Composition[] = [...blocks, ...templates];
