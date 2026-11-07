import { CalendarDaysIcon, ContactIcon, FolderKanbanIcon, HandshakeIcon, HouseIcon, InboxIcon, Network, ReceiptIcon, SlidersHorizontalIcon, Trash2Icon, WalletIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { AppHeader, AppLogo, AppShell, AppSidebar, LocaleSwitch, SearchButton } from '@/components/company-os';
import type { NavGroup } from '@/components/company-os';

const groups: NavGroup[] = [
    { label: 'Daily', items: [{ title: 'Home', href: '/templates/home', icon: HouseIcon }, { title: 'Inbox', href: '/templates/inbox', icon: InboxIcon }, { title: 'Calendar', href: '/templates/calendar', icon: CalendarDaysIcon }] },
    { label: 'Clients', items: [{ title: 'Contacts', href: '/templates/contacts', icon: ContactIcon }, { title: 'Deals', href: '/templates/deals', icon: HandshakeIcon }] },
    { label: 'Work', items: [{ title: 'Projects', href: '/templates/projects', icon: FolderKanbanIcon }] },
    { label: 'Finance', items: [{ title: 'Invoices', href: '/templates/invoices', icon: ReceiptIcon }, { title: 'Expenses', href: '/templates/expenses', icon: WalletIcon }] },
    { label: 'Manage', items: [{ title: 'Setup', href: '/templates/setup-page', icon: SlidersHorizontalIcon }, { title: 'Organization', href: '/templates/users-page', icon: Network }, { title: 'Trash', href: '/templates/trash-page', icon: Trash2Icon }] },
];

function Mark() {
    return <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/40">H</span>;
}

export function TemplateShell({ children }: { children: ReactNode }) {
    return (
        <AppShell
            sidebar={<AppSidebar logo={<AppLogo icon={<Mark />} name="Halcyon" />} homeHref="/templates" groups={groups} permissions={[]} />}
            header={
                <AppHeader>
                    <SearchButton onClick={() => undefined} />
                    <LocaleSwitch locales={[{ value: 'en', label: 'English' }, { value: 'so', label: 'Soomaali' }]} current="en" onChange={() => undefined} />
                </AppHeader>
            }
        >
            {children}
        </AppShell>
    );
}
