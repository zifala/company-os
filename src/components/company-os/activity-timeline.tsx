import { HistoryIcon } from 'lucide-react';
import { ActivityEntryItem } from '@/components/company-os/activity-entry';
import type { ActivityEntry } from '@/components/company-os/activity-entry';
import { EmptyState } from '@/components/company-os/empty-state';

export type ActivityLabels = { emptyTitle: string; emptyMessage: string; system: string };

const defaultLabels: ActivityLabels = {
    emptyTitle: 'No activity yet',
    emptyMessage: 'No changes, comments or uploads.',
    system: 'System',
};

export function ActivityTimeline({
    entries,
    showSubject = false,
    labels = defaultLabels,
}: {
    entries: ActivityEntry[];
    showSubject?: boolean;
    labels?: ActivityLabels;
}) {
    if (entries.length === 0) {
        return <EmptyState icon={HistoryIcon} title={labels.emptyTitle} message={labels.emptyMessage} />;
    }

    const days = entries.reduce<{ label: string; entries: ActivityEntry[] }[]>((groups, entry) => {
        const last = groups.at(-1);

        if (last?.label === entry.day_label) {
            last.entries.push(entry);
        } else {
            groups.push({ label: entry.day_label, entries: [entry] });
        }

        return groups;
    }, []);

    return (
        <div className="grid gap-5">
            {days.map((day) => (
                <section key={day.label} className="grid gap-3">
                    <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{day.label}</h3>
                    <ol className="relative before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:bg-border">
                        {day.entries.map((entry) => (
                            <ActivityEntryItem key={entry.id} entry={entry} showSubject={showSubject} systemLabel={labels.system} />
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    );
}
