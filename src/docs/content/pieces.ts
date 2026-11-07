export interface Piece {
    n: number;
    slug: string;
    title: string;
    summary: string;
    components: string[];
}

export const pieces: Piece[] = [
    { n: 1, slug: 'actions', title: 'Actions', summary: 'One Action per verb. Guard, write, audit, notify inside. Thin controllers.', components: [] },
    { n: 2, slug: 'audit', title: 'Audit', summary: 'noun.verb_past events, reason on serious changes, audit log page + CSV.', components: ['activity-timeline'] },
    { n: 3, slug: 'event-bus', title: 'Event bus', summary: 'Activity row = event bus for automations and webhooks.', components: [] },
    { n: 4, slug: 'permissions', title: 'Permissions', summary: 'Config registry → spatie sync. Roles in UI. Grant only what you hold. Perms shared to Inertia.', components: ['nav'] },
    { n: 5, slug: 'scoped-permissions', title: 'Scoped permissions', summary: 'Scope per permission: firm / department / assigned / own. Sensitive switches. Delegated grants.', components: [] },
    { n: 6, slug: 'people-lifecycle', title: 'People lifecycle', summary: 'Invite, deactivate with successor + handover, reactivate, forced password change, 2FA for privileged.', components: ['reason-dialog', 'password-input', 'phone-field', 'verify-phone-dialog'] },
    { n: 7, slug: 'settings', title: 'Settings', summary: 'Workspace singleton + per-user timezone, quiet hours. Secrets in env; UI shows ok / missing.', components: ['section-layout', 'detail-card'] },
    { n: 8, slug: 'setup-checklist', title: 'Setup checklist', summary: 'Checklist ticks from real data. Super admin redirected until done.', components: ['setup-checklist'] },
    { n: 9, slug: 'tour', title: 'Tour', summary: 'One-time tour, skips hidden steps, replay ?tour=1.', components: ['app-tour'] },
    { n: 10, slug: 'notifications', title: 'Notifications', summary: 'After commit, recipient filter, per-event channel matrix, quiet hours, digest, inbox + bell.', components: ['notification-bell'] },
    { n: 11, slug: 'signals', title: 'Signals', summary: 'Morning brief, reminders with a sent-ledger, rule signals.', components: [] },
    { n: 12, slug: 'calendar-feed', title: 'Calendar feed', summary: 'Per-user ICS feed.', components: [] },
    { n: 13, slug: 'command-palette', title: 'Command palette', summary: '⌘K palette (search + actions + go-to), g-keys, one global "New".', components: ['command-palette', 'quick-create', 'shortcut-help'] },
    { n: 14, slug: 'trash', title: 'Trash', summary: 'Soft delete, 30-day restore, purge job.', components: ['confirm-dialog', 'reason-dialog'] },
    { n: 15, slug: 'views-import-export', title: 'Views, import, export', summary: 'Saved views, favorites, CSV import with preview, export.', components: ['saved-views-menu', 'favorite-button', 'csv-import', 'export-button'] },
    { n: 16, slug: 'status-dialog', title: 'Status dialog', summary: 'Every status change through a confirm / reason dialog.', components: ['confirm-dialog', 'reason-dialog'] },
    { n: 17, slug: 'print-layouts', title: 'Print layouts', summary: 'Print / PDF layouts for official documents.', components: [] },
    { n: 18, slug: 'bilingual', title: 'Bilingual', summary: 'lang/en + lang/so, enum labels from lang. Day one.', components: ['locale-switch'] },
    { n: 19, slug: 'shell', title: 'Shell', summary: 'Sidebar groups daily → setup, header search + bell, Settings/ vs Organization/.', components: ['app-shell', 'app-sidebar', 'app-header', 'nav'] },
    { n: 20, slug: 'page-kit', title: 'Page kit', summary: 'PageHeader, FilterBar + DataTable (typed cells) + EmptyState, TabNav, ActionsMenu, ReasonDialog, ActivityTimeline, StatTile, skeleton, load-error.', components: ['page-header', 'filter-bar', 'data-table', 'cells', 'pill', 'empty-state', 'tab-nav', 'actions-menu', 'activity-timeline', 'stat-tile', 'detail-card', 'form-layout', 'field-row', 'remote-combobox', 'list-skeleton', 'load-error'] },
    { n: 21, slug: 'docs-ci', title: 'Docs & CI', summary: 'Docs system, agent files, CI ci:check + audits, Larastan 7.', components: [] },
    { n: 22, slug: 'webhooks', title: 'Webhooks', summary: 'Signed endpoints, delivery log + retry, SSRF IP pinning, auto-disable on repeated failure.', components: [] },
    { n: 23, slug: 'audit-channel', title: 'Audit channel', summary: 'Every activity row stamped via web / api / automation / agent.', components: ['activity-timeline'] },
    { n: 24, slug: 'insights', title: 'Insights', summary: 'Rule signals raise one live insight per kind + scope, dismiss with quiet period, apply suggestion.', components: ['insight-item'] },
    { n: 25, slug: 'setup-lists', title: 'Setup lists', summary: 'Values a company adds or renames are rows. Enums only where code branches.', components: ['form-dialog', 'data-table', 'section-layout'] },
    { n: 26, slug: 'section-nav', title: 'Section nav', summary: 'Setup and Organization open a grouped inner sidebar; landing redirects to first permitted page.', components: ['section-layout'] },
    { n: 27, slug: 'onboarding', title: 'Onboarding', summary: 'Relationship records born only from an approved onboarding. Steps, review, send back, guest link.', components: ['onboarding-card', 'phone-field', 'verify-phone-dialog', 'form-layout'] },
];

export const pieceBySlug = (slug: string) => pieces.find((piece) => piece.slug === slug);
