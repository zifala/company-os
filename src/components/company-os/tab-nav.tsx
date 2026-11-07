import { Link, toUrl, useCurrentUrl } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type TabLink = {
    label: string;
    href: Href;
    count?: number;
};

const base = 'http://localhost';

const sameTab = (href: Href, current: string): boolean => {
    const target = new URL(toUrl(href), base);
    const here = new URL(current, base);
    const query = [...target.searchParams];

    return (
        target.pathname === here.pathname &&
        query.every(([key, value]) => here.searchParams.get(key) === value) &&
        (query.length > 0 || [...here.searchParams].length === 0)
    );
};

export function TabNav({ tabs, label }: { tabs: TabLink[]; label: string }) {
    const current = useCurrentUrl();

    return (
        <nav className="flex gap-1 overflow-x-auto border-b border-border" aria-label={label}>
            {tabs.map((tab) => {
                const active = sameTab(tab.href, current);

                return (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        preserveScroll
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-all duration-300',
                            active ? 'border-primary text-primary' : 'border-transparent hover:text-primary',
                        )}
                    >
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className="rounded-full bg-slate-900/5 px-1.5 text-xs tabular-nums">{tab.count}</span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
