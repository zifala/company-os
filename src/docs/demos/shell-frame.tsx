import { CompassIcon, LogOutIcon, SettingsIcon, SparklesIcon } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { toast } from 'sonner';
import {
    AppHeader,
    AppLogo,
    AppShell,
    AppSidebar,
    LocaleSwitch,
    NavUser,
    NotificationBell,
    QuickCreate,
    SearchButton,
} from '@/components/company-os';
import type { Favorite } from '@/components/company-os';
import { fakeNotifications, managerPermissions, navGroups, quickCreateItems, user } from './shell-sample';

export const wouldOpen = (url: string) => toast(`Would open ${url}`);

export function DemoLinks({ children, className }: { children: ReactNode; className?: string }) {
    const intercept = (event: MouseEvent<HTMLDivElement>) => {
        const anchor = (event.target as Element).closest('a[href]');

        if (anchor) {
            event.preventDefault();
            wouldOpen(anchor.getAttribute('href') ?? '');
        }
    };

    return (
        <div className={className} onClickCapture={intercept}>
            {children}
        </div>
    );
}

export function ShellFrame({ children }: { children: ReactNode }) {
    return <DemoLinks className="h-[520px] overflow-hidden rounded-lg glass">{children}</DemoLinks>;
}

export function SampleSidebar({ favorites = [] }: { favorites?: Favorite[] }) {
    return (
        <AppSidebar
            collapsible="none"
            variant="sidebar"
            logo={<AppLogo icon={<SparklesIcon className="size-6" />} name="Northwind" />}
            homeHref="/dashboard"
            groups={navGroups}
            permissions={managerPermissions}
            favorites={favorites}
            create={<QuickCreate items={quickCreateItems((kind) => toast(`Would open the ${kind} dialog`))} />}
            footer={
                <NavUser
                    user={user}
                    items={[
                        { label: 'Settings', icon: SettingsIcon, href: '/settings/profile' },
                        { label: 'Take the tour', icon: CompassIcon, href: '/dashboard?tour=1' },
                    ]}
                    logout={{ label: 'Log out', icon: LogOutIcon, onSelect: () => toast('Would log out') }}
                />
            }
        />
    );
}

export function SampleHeader({ onSearch }: { onSearch: () => void }) {
    return (
        <AppHeader>
            <SearchButton onClick={onSearch} />
            <LocaleSwitch locales={[{ value: 'en', label: 'English' }, { value: 'so', label: 'Soomaali' }]} current="en" onChange={() => undefined} />
            <NotificationBell count={3} onOpen={fakeNotifications} markAllHref="/notifications/read" historyHref="/notifications/history" />
        </AppHeader>
    );
}

export function SampleShell({ header, children }: { header: ReactNode; children: ReactNode }) {
    return (
        <ShellFrame>
            <AppShell className="min-h-0 h-full" sidebar={<SampleSidebar />} header={header}>
                {children}
            </AppShell>
        </ShellFrame>
    );
}
