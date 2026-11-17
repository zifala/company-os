import { CalendarIcon, RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/company-os/confirm-dialog';
import { SecretReveal } from '@/components/company-os/secret-reveal';
import { Button } from '@/components/ui/button';

export type CalendarFeedLabels = {
    title: string;
    on: string;
    off: string;
    intro: string;
    create: string;
    reset: string;
    revoke: string;
    url: string;
    once: string;
    resetTitle: string;
    resetConsequence: string;
    revokeTitle: string;
    revokeConsequence: string;
    keep: string;
};

export const calendarFeedLabels: CalendarFeedLabels = {
    title: 'Calendar feed',
    on: 'On',
    off: 'Off',
    intro: 'Subscribe from Google Calendar, Outlook or Apple Calendar to see your own events, reminders and due dates. The link shows titles and links only.',
    create: 'Create link',
    reset: 'Reset link',
    revoke: 'Revoke',
    url: 'Your calendar link',
    once: 'Paste it into your calendar app now. It is shown once; reset to get a new one.',
    resetTitle: 'Reset the calendar link',
    resetConsequence: 'The old link stops working at once. Calendars subscribed to it stop updating until you add the new one.',
    revokeTitle: 'Revoke the calendar link',
    revokeConsequence: 'The link stops working at once and no new one is made. Subscribed calendars stop updating.',
    keep: 'Keep it',
};

export function CalendarFeedCard({
    active,
    url,
    processing = false,
    onCreate,
    onRevoke,
    labels: custom,
}: {
    active: boolean;
    url: string | null;
    processing?: boolean;
    onCreate: () => void;
    onRevoke: () => void;
    labels?: Partial<CalendarFeedLabels>;
}) {
    const labels = { ...calendarFeedLabels, ...custom };
    const [confirming, setConfirming] = useState<'reset' | 'revoke' | null>(null);
    const resetting = confirming === 'reset';

    return (
        <section className="rounded-lg glass">
            <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                <CalendarIcon className="size-4 text-muted-foreground" aria-hidden />
                <h2 className="text-sm font-semibold text-slate-800">{labels.title}</h2>
                <span className={active ? 'ml-auto text-xs font-medium text-success' : 'ml-auto text-xs font-medium text-muted-foreground'}>{active ? labels.on : labels.off}</span>
            </div>
            <div className="grid gap-4 p-5">
                <p className="text-sm text-muted-foreground">{labels.intro}</p>
                {url && <SecretReveal id="calendar-feed-url" label={labels.url} value={url} labels={{ once: labels.once }} />}
                <div className="flex flex-wrap gap-2">
                    {active ? (
                        <>
                            <Button variant="outline" disabled={processing} onClick={() => setConfirming('reset')}>
                                <RefreshCwIcon /> {labels.reset}
                            </Button>
                            <Button variant="ghost" className="text-destructive" disabled={processing} onClick={() => setConfirming('revoke')}>
                                {labels.revoke}
                            </Button>
                        </>
                    ) : (
                        <Button disabled={processing} onClick={onCreate}>
                            {labels.create}
                        </Button>
                    )}
                </div>
            </div>
            <ConfirmDialog
                open={confirming !== null}
                onOpenChange={(open) => !open && setConfirming(null)}
                title={resetting ? labels.resetTitle : labels.revokeTitle}
                consequence={resetting ? labels.resetConsequence : labels.revokeConsequence}
                confirmLabel={resetting ? labels.reset : labels.revoke}
                cancelLabel={labels.keep}
                destructive={!resetting}
                processing={processing}
                onConfirm={() => {
                    setConfirming(null);
                    if (resetting) {
                        onCreate();
                    } else {
                        onRevoke();
                    }
                }}
            />
        </section>
    );
}
