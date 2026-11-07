import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { NotificationList, notificationLabels } from '@/components/company-os/notification-list';
import type { NotificationData, NotificationLabels } from '@/components/company-os/notification-list';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

type Load = { status: 'loading' } | { status: 'failed' } | { status: 'ready'; data: NotificationData };

export function NotificationBell({
    count,
    onOpen,
    markAllHref,
    historyHref,
    labels: custom,
}: {
    count: number;
    onOpen: () => Promise<NotificationData>;
    markAllHref?: Href;
    historyHref?: Href;
    labels?: Partial<NotificationLabels>;
}) {
    const labels = { ...notificationLabels, ...custom };
    const [open, setOpen] = useState(false);
    const [load, setLoad] = useState<Load>({ status: 'loading' });

    const show = () => {
        setOpen(true);
        setLoad({ status: 'loading' });
        onOpen()
            .then((data) => setLoad({ status: 'ready', data }))
            .catch(() => setLoad({ status: 'failed' }));
    };

    return (
        <>
            <Button variant="ghost" size="icon" className="relative" aria-label={labels.title} data-tour="bell" onClick={show}>
                <BellIcon className="size-5" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
                    <SheetHeader className="flex-row items-center justify-between border-b px-5 py-4">
                        <SheetTitle>{labels.title}</SheetTitle>
                        {markAllHref && count > 0 && (
                            <Link href={markAllHref} className="mr-6 text-xs text-primary hover:underline" onClick={() => setOpen(false)}>
                                {labels.markAll}
                            </Link>
                        )}
                    </SheetHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto pb-4">
                        {load.status === 'loading' && <p className="px-5 py-6 text-sm text-muted-foreground">{labels.loading}</p>}
                        {load.status === 'failed' && <p className="px-5 py-6 text-sm text-rose-600">{labels.failed}</p>}
                        {load.status === 'ready' && (
                            <NotificationList data={load.data} labels={labels} onPick={() => setOpen(false)} />
                        )}
                    </div>
                    {historyHref && (
                        <Link
                            href={historyHref}
                            onClick={() => setOpen(false)}
                            className="block border-t px-5 py-3 text-center text-xs text-primary transition-all duration-300 hover:bg-primary/5"
                        >
                            {labels.history}
                        </Link>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}
