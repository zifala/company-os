import {
    BookOpenIcon,
    BotIcon,
    HouseIcon,
    LayoutGridIcon,
    LayoutTemplateIcon,
    ListChecksIcon,
    MapIcon,
    PuzzleIcon,
} from 'lucide-react';
import { Suspense, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader, AppLogo, AppShell, AppSidebar, SearchButton } from '@/components/company-os';
import type { NavGroup } from '@/components/company-os';
import { categories } from '../content/categories';

const groups: NavGroup[] = [
    {
        label: 'Guide',
        items: [
            { title: 'Introduction', href: '/', icon: HouseIcon },
            { title: 'Standard', href: '/standard', icon: ListChecksIcon },
            { title: 'AI-ready', href: '/ai', icon: BotIcon },
            { title: 'Roadmap', href: '/roadmap', icon: MapIcon },
        ],
    },
    {
        label: 'Library',
        items: [
            { title: 'Components', href: '/components', icon: PuzzleIcon },
            { title: 'Blocks', href: '/blocks', icon: LayoutGridIcon },
            { title: 'Templates', href: '/templates', icon: LayoutTemplateIcon },
        ],
    },
    {
        label: 'Categories',
        items: categories.map((category) => ({
            title: category.label,
            href: `/components?cat=${category.id}`,
            icon: BookOpenIcon,
        })),
    },
];

function Mark() {
    return (
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/40">
            C
        </span>
    );
}

export function Shell({ onSearch }: { onSearch: () => void }) {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        <AppShell
            sidebar={
                <AppSidebar
                    logo={<AppLogo icon={<Mark />} name="Company OS" />}
                    homeHref="/"
                    groups={groups}
                    permissions={[]}
                />
            }
            header={
                <AppHeader>
                    <SearchButton onClick={onSearch} />
                </AppHeader>
            }
        >
            <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
                <Outlet />
            </Suspense>
            <p className="pt-6 text-xs text-muted-foreground">Company OS · the standard travels, the look stays home.</p>
        </AppShell>
    );
}

export function PageTitle({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
                <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
                {lead && <p className="mt-1 text-sm text-muted-foreground">{lead}</p>}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}

export function Stack({ children }: { children: ReactNode }) {
    return <div className="grid gap-6">{children}</div>;
}
