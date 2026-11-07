import type { ReactNode } from 'react';
import { visibleGroups } from '@/components/company-os/nav';
import type { NavGroup } from '@/components/company-os/nav';
import { useActiveNavHref } from '@/components/company-os/use-active-nav-href';
import { Link, toUrl } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function SectionLayout({
    title,
    groups,
    permissions,
    children,
}: {
    title: string;
    groups: NavGroup[];
    permissions: string[];
    children: ReactNode;
}) {
    const visible = visibleGroups(groups, permissions);
    const activeHref = useActiveNavHref(
        visible.flatMap((group) => group.items.map((item) => toUrl(item.href))),
    );
    const showNav = visible.flatMap((group) => group.items).length > 1;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
                {showNav && (
                    <nav
                        aria-label={title}
                        className="flex gap-1 overflow-x-auto lg:w-48 lg:shrink-0 lg:flex-col lg:gap-5 lg:overflow-visible"
                    >
                        {visible.map((group, index) => (
                            <div key={group.label ?? index} className="flex gap-1 lg:grid lg:gap-0.5">
                                {group.label && (
                                    <span className="hidden px-3 pb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase lg:block">
                                        {group.label}
                                    </span>
                                )}
                                {group.items.map((item) => {
                                    const active = toUrl(item.href) === activeHref;

                                    return (
                                        <Link
                                            key={toUrl(item.href)}
                                            href={item.href}
                                            prefetch
                                            aria-current={active ? 'page' : undefined}
                                            className={cn(
                                                'flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-sm whitespace-nowrap transition-all duration-300 hover:bg-primary/5 hover:text-primary',
                                                active && 'bg-primary/10 text-primary',
                                            )}
                                        >
                                            {item.icon && <item.icon className="size-4" />}
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                )}
                <section className="min-w-0 flex-1">{children}</section>
            </div>
        </div>
    );
}
