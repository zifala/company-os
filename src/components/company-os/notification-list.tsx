import { ChevronRightIcon } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type WaitingItem = { key: string; label: string; count: number; href: string };

export type RecentItem = {
    id: string;
    message: string;
    url: string | null;
    read: boolean;
    at_label: string;
};

export type NotificationData = { waiting: WaitingItem[]; recent: RecentItem[] };

export type NotificationLabels = {
    title: string;
    waiting: string;
    recent: string;
    nothingWaiting: string;
    noRecent: string;
    loading: string;
    failed: string;
    markAll: string;
    history: string;
};

export const notificationLabels: NotificationLabels = {
    title: 'Notifications',
    waiting: 'Needs your attention',
    recent: 'Recent',
    nothingWaiting: 'Nothing is waiting for you.',
    noRecent: 'Assignments, mentions, comments and reminders show here.',
    loading: 'Loading',
    failed: 'The list did not load. Close and open the bell again.',
    markAll: 'Mark all read',
    history: 'View all notifications',
};

function SectionTitle({ children }: { children: string }) {
    return (
        <h3 className="px-5 pt-5 pb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">{children}</h3>
    );
}

function Hint({ children }: { children: string }) {
    return <p className="px-5 pb-2 text-sm text-muted-foreground">{children}</p>;
}

export function NotificationList({
    data,
    labels,
    onPick,
}: {
    data: NotificationData;
    labels: NotificationLabels;
    onPick: () => void;
}) {
    const recentClass = 'grid gap-0.5 px-5 py-3 text-sm';

    return (
        <>
            <SectionTitle>{labels.waiting}</SectionTitle>
            {data.waiting.length === 0 && <Hint>{labels.nothingWaiting}</Hint>}
            {data.waiting.length > 0 && (
                <ul className="divide-y border-y">
                    {data.waiting.map((item) => (
                        <li key={item.key}>
                            <Link
                                href={item.href}
                                onClick={onPick}
                                className="flex items-center gap-3 px-5 py-3 text-sm transition-all duration-300 hover:bg-primary/5"
                            >
                                <span className="flex-1">{item.label}</span>
                                <span className="font-bold tabular-nums">{item.count}</span>
                                <ChevronRightIcon className="size-4 text-slate-400" />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <SectionTitle>{labels.recent}</SectionTitle>
            {data.recent.length === 0 && <Hint>{labels.noRecent}</Hint>}
            {data.recent.length > 0 && (
                <ul className="divide-y border-y">
                    {data.recent.map((item) => {
                        const body = (
                            <>
                                <span className={item.read ? 'text-muted-foreground' : 'text-slate-800'}>{item.message}</span>
                                <span className="text-xs text-muted-foreground">{item.at_label}</span>
                            </>
                        );

                        return (
                            <li key={item.id}>
                                {item.url ? (
                                    <Link
                                        href={item.url}
                                        onClick={onPick}
                                        className={cn(recentClass, 'transition-all duration-300 hover:bg-primary/5')}
                                    >
                                        {body}
                                    </Link>
                                ) : (
                                    <div className={recentClass}>{body}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
