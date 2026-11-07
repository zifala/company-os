import { Prose, Section } from '../blocks';
import { PageTitle, Stack } from '../shell';

const roadmap: { title: string; note: string; items: { t: string; d: string }[] }[] = [
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
        title: 'Next',
        note: 'v0.2.0 · the firewall and the gaps',
        items: [
            { t: 'Firewall', d: 'A lint that fails on Inertia imports outside the seam, breadcrumbs, native selects, avatars in tables, and a table swapped for an empty card.' },
            { t: 'Roles page', d: 'The role form: name on top, permission picker below, scope per permission and the sensitive switches.' },
            { t: 'Notification history and the preference matrix', d: 'The inbox page and the event × channel grid from the notifications recipe.' },
            { t: 'Onboarding stepper', d: 'The full-screen stepper with the left rail, the review step and the guest link page.' },
            { t: 'Print layout', d: 'The A4 print sheet for invoices and statements.' },
        ],
    },
    {
        title: 'Exploring',
        note: 'later',
        items: [
            { t: 'Laravel side', d: 'A composer package for the server half of each recipe: ReasonRequest, TrashBin, SetupSteps, GlobalSearch.' },
            { t: 'Registry MCP', d: 'Search components and pieces from any assistant.' },
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
