import { PlusIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AppHeader,
    AppShell,
    AppTour,
    CommandPalette,
    LocaleSwitch,
    NotificationBell,
    PageHeader,
    QuickCreate,
    SearchButton,
    SectionLayout,
    ShortcutHelp,
    goShortcuts,
    shellShortcutGroups,
    visibleGroups,
} from '@/components/company-os';
import { StatTile } from '@/components/company-os/stat-tile';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DemoLinks, SampleHeader, SampleShell, SampleSidebar, ShellFrame, wouldOpen } from './shell-frame';
import {
    fakeNotifications,
    fakeSearch,
    managerPermissions,
    memberPermissions,
    navGroups,
    organizationGroups,
    paletteActions,
    quickCreateItems,
} from './shell-sample';

function CommandPaletteDemo() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SearchButton onClick={() => setOpen(true)} />
            <CommandPalette
                open={open}
                onOpenChange={setOpen}
                groups={navGroups}
                permissions={[...managerPermissions, 'contacts.create']}
                actions={paletteActions(() => toast('Would open the shortcut sheet'))}
                onSearch={fakeSearch}
                onNavigate={wouldOpen}
            />
        </>
    );
}

function ShortcutHelpDemo() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Show keyboard shortcuts <Kbd>?</Kbd>
            </Button>
            <ShortcutHelp open={open} onOpenChange={setOpen} groups={shellShortcutGroups(goShortcuts(navGroups, managerPermissions))} />
        </>
    );
}

function NotificationBellDemo() {
    return (
        <DemoLinks>
            <NotificationBell count={3} onOpen={fakeNotifications} markAllHref="/notifications/read" historyHref="/notifications/history" />
        </DemoLinks>
    );
}

function AppTourDemo() {
    const [run, setRun] = useState(false);

    return (
        <div className="grid gap-4">
            <div className="flex items-center gap-2">
                <Button onClick={() => setRun(true)}>Take the tour</Button>
                <span data-tour="demo-search" className="inline-flex">
                    <SearchButton onClick={() => undefined} />
                </span>
            </div>
            <div data-tour="demo-stats" className="grid grid-cols-2 gap-3 sm:w-80">
                <StatTile label="Open invoices" value={12} />
                <StatTile label="Overdue" value={3} />
            </div>
            <AppTour
                run={run}
                delayMs={100}
                onFinish={() => setRun(false)}
                steps={[
                    { target: 'demo-search', title: 'Search', description: 'Find any record by name, or press ⌘K.' },
                    { target: 'demo-stats', title: 'Numbers first', description: 'Every home page opens with the counts that matter today.' },
                ]}
            />
        </div>
    );
}

function NavGating() {
    const roles = [
        { name: 'Manager', permissions: managerPermissions },
        { name: 'Member', permissions: memberPermissions },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            {roles.map((role) => (
                <div key={role.name} className="grid gap-3">
                    <h3 className="text-sm font-semibold text-slate-800">{role.name}</h3>
                    {visibleGroups(navGroups, role.permissions).map((group) => (
                        <div key={group.label} className="grid gap-1">
                            <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{group.label}</span>
                            {group.items.map((item) => (
                                <div key={item.title} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        {item.icon && <item.icon className="size-4 text-slate-400" />}
                                        {item.title}
                                    </span>
                                    {item.goKey && (
                                        <span className="flex gap-1">
                                            <Kbd>G</Kbd>
                                            <Kbd>{item.goKey.toUpperCase()}</Kbd>
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function AppShellDemo() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SampleShell header={<SampleHeader onSearch={() => setOpen(true)} />}>
                <PageHeader title="Invoices">
                    <Button>
                        <PlusIcon /> Create invoice
                    </Button>
                </PageHeader>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatTile label="Open" value={12} />
                    <StatTile label="Overdue" value={3} />
                    <StatTile label="Paid this month" value="48,200" unit="USD" />
                    <StatTile label="Drafts" value={2} />
                </div>
            </SampleShell>
            <CommandPalette
                open={open}
                onOpenChange={setOpen}
                groups={navGroups}
                permissions={managerPermissions}
                actions={paletteActions(() => undefined)}
                onSearch={fakeSearch}
                onNavigate={wouldOpen}
            />
        </>
    );
}

function AppSidebarDemo() {
    return (
        <ShellFrame>
            <AppShell
                className="min-h-0 h-full"
                sidebar={<SampleSidebar favorites={[{ id: 'f-1', title: 'Harbour terminal rollout', href: '/projects/1' }]} />}
                header={<AppHeader />}
            >
                <p className="text-sm text-muted-foreground">Favorites above the groups. Groups ordered daily → setup. Setup last.</p>
            </AppShell>
        </ShellFrame>
    );
}

function QuickCreateDemo() {
    return (
        <SidebarProvider className="min-h-0 w-56">
            <QuickCreate items={quickCreateItems((kind) => toast(`Would open the ${kind} dialog`))} />
        </SidebarProvider>
    );
}

function AppHeaderDemo() {
    return (
        <SidebarProvider className="min-h-0">
            <DemoLinks className="w-full rounded-lg glass">
                <SampleHeader onSearch={() => toast('Would open the palette')} />
            </DemoLinks>
        </SidebarProvider>
    );
}

function SectionLayoutDemo() {
    return (
        <DemoLinks>
            <SectionLayout title="Organization" groups={organizationGroups} permissions={managerPermissions}>
                <div className="rounded-lg bg-slate-900/5 p-6 text-sm text-muted-foreground">The page content for the active item renders here.</div>
            </SectionLayout>
        </DemoLinks>
    );
}

function LocaleSwitchDemo() {
    const [current, setCurrent] = useState('en');

    return (
        <LocaleSwitch
            locales={[{ value: 'en', label: 'English' }, { value: 'so', label: 'Soomaali' }]}
            current={current}
            onChange={setCurrent}
        />
    );
}

export const shellDemos: Record<string, ComponentType> = {
    'command-palette': CommandPaletteDemo,
    'shortcut-help': ShortcutHelpDemo,
    'notification-bell': NotificationBellDemo,
    'app-tour': AppTourDemo,
    'nav-gating': NavGating,
    'app-shell': AppShellDemo,
    'app-sidebar': AppSidebarDemo,
    'quick-create': QuickCreateDemo,
    'app-header': AppHeaderDemo,
    'section-layout': SectionLayoutDemo,
    'locale-switch': LocaleSwitchDemo,
};
