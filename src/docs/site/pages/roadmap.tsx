import { Prose, Section } from '../blocks';
import { PageTitle, Stack } from '../shell';

const roadmap: { title: string; note: string; items: { t: string; d: string }[] }[] = [
    {
        title: 'Shipped',
        note: 'v0.3.0 · the rest of Organization, the server half, the MCP',
        items: [
            { t: 'Organization', d: 'A new category. AuditLogTable, ServiceStatusList, LetterheadPreview, WebhookEventPicker, WebhookDeliveryLog, WebhookEndpointStatus, SecretReveal, GrantList, CalendarFeedCard.' },
            { t: 'Audit log page', d: 'One table of events with who, the via channel, the label over the raw event name, the subject and the reason. Filters by person, event prefix, channel and dates; the CSV export honours them.' },
            { t: 'Workspace and services', d: 'The workspace singleton form with the letterhead the print sheet reads, previewed as you type, the two-factor switch, and the services panel showing configured or missing with the env names. Setup now uses the same panel.' },
            { t: 'Webhooks', d: 'Endpoints with their state and last delivery; add one with the event picker and see the signing secret once. The endpoint page: the auto-disabled banner with Enable, send test, rotate, turn off with a reason, the delivery log with resend.' },
            { t: 'Delegated grants', d: 'The per-person Grants tab: who granted which page and when, grant only what you hold, revoke with a reason, revoked rows kept.' },
            { t: 'Calendar feed', d: 'The personal ICS link in Settings · Notifications: create, shown once, reset and revoke behind a confirm.' },
            { t: 'Laravel side', d: 'packages/laravel, the company-os/laravel composer package: ReasonRequest, TrashBin, SetupSteps, GlobalSearch and the helpers they need, ported from the recipes with tests.' },
            { t: 'Registry MCP', d: 'mcp/server.mjs: search_registry, list_registry, get_component, get_composition, get_piece over stdio, from a local build or a deployed site. build-llms now emits the pieces and llms/index.json for it.' },
        ],
    },
    {
        title: 'Shipped',
        note: 'v0.2.0 · the firewall and the gaps',
        items: [
            { t: 'Firewall', d: 'pnpm lint fails the build on Inertia imports outside the seam, the router imported past it, breadcrumbs, native selects, avatars in tables, and a table swapped for an empty card.' },
            { t: 'Access', d: 'A new category. PermissionPicker with a scope per permission and a lock on what the editor does not hold, SensitiveSwitches, PreferenceMatrix.' },
            { t: 'Roles', d: 'The role form inside Organization: name on top, permission picker below, sensitive switches under it. The roles list with the super admin locked and delete only when unused.' },
            { t: 'Notification history and the preference matrix', d: 'The inbox behind the bell, filtered by event and read state, and the event × channel grid in personal settings.' },
            { t: 'Onboarding stepper', d: 'OnboardingStepper and its rail, ReviewProblems, the full-screen stepper with the send-back banner, the guest link page, and the reviewer\'s page with Reject · Send back · Approve.' },
            { t: 'Print layout', d: 'PrintSheet, PrintLines, PrintTotals, PrintBlock and the A4 invoice: repeating header and footer, totals that never split, the draft stamp.' },
        ],
    },
    {
        title: 'Shipped',
        note: 'v0.1.0 · the site, the kit, the screens',
        items: [
            { t: 'The site', d: 'Introduction, the standard with 27 piece pages mirrored from the skill, component pages in the 76° shape, blocks, templates, AI-ready, ⌘K search. The site runs the shell it documents.' },
            { t: 'The theme', d: 'Indigo on slate, glass panels, Inter and Geist Mono. One app.css; the shadcn primitives carry it. Another brand changes the tokens.' },
            { t: 'One seam', d: 'lib/navigation.tsx is the only place Inertia appears. Permissions, request state and copy arrive as props, so the same source renders here and in a product.' },
            { t: 'Shell', d: 'AppShell, AppSidebar with gated groups and favorites, QuickCreate, AppHeader with search, CommandPalette with go-keys, ShortcutHelp, NotificationBell as a sheet, LocaleSwitch, SectionLayout, AppTour.' },
            { t: 'Page kit', d: 'PageHeader, FilterBar, DataTable with the table-keeping empty state, typed Cells, Pill, EmptyState, TabNav, ActionsMenu, StatTile, ActivityTimeline, DetailCard, FormLayout, FieldRow, ListSkeleton, LoadError.' },
            { t: 'Dialogs, forms, views, setup', d: 'ConfirmDialog, ReasonDialog with typed-name delete, FormDialog, PhoneField, PasswordInput, RemoteCombobox, VerifyPhoneDialog, SavedViewsMenu, FavoriteButton, ExportButton, CsvImport, SetupChecklist, OnboardingCard, InsightItem.' },
            { t: 'Blocks and templates', d: 'Index page, record page, full-page form, home. Users, trash, setup and settings pages inside the shell.' },
        ],
    },
    {
        title: 'Exploring',
        note: 'later',
        items: [
            { t: 'Publish the Laravel package', d: 'Tag company-os/laravel and put it on Packagist once a product has run it in production.' },
            { t: 'Registry MCP over HTTP', d: 'The same tools on the deployed site, for assistants that cannot spawn a local process.' },
        ],
    },
];

export function RoadmapPage() {
    return (
        <>
            <PageTitle title="Roadmap" lead="What has shipped, what is next, and what we are still weighing." />
            <Stack>
                {roadmap.map((phase) => (
                    <Section key={phase.note} title={phase.title} subtitle={phase.note}>
                        <Prose>
                            {phase.items.map((item) => (
                                <p key={item.t}>
                                    <b className="font-semibold text-slate-800">{item.t}.</b> {item.d}
                                </p>
                            ))}
                        </Prose>
                    </Section>
                ))}
            </Stack>
        </>
    );
}
