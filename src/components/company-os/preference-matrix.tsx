import { useId } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export type PreferenceEvent = {
    key: string;
    label: string;
    hint?: string;
    group?: string;
};

export type PreferenceChannel = {
    key: string;
    label: string;
    available?: boolean;
    unavailableHint?: string;
};

export type PreferenceValue = Record<string, Record<string, boolean>>;

export type PreferenceMatrixLabels = { event: string; quietHours: string | null };

export const preferenceMatrixLabels: PreferenceMatrixLabels = {
    event: 'Event',
    quietHours: 'Email waits until your quiet hours end. In-app always arrives.',
};

function groupsOf(events: PreferenceEvent[]): { label: string | undefined; events: PreferenceEvent[] }[] {
    const out: { label: string | undefined; events: PreferenceEvent[] }[] = [];
    for (const event of events) {
        const last = out.at(-1);
        if (last && last.label === event.group) last.events.push(event);
        else out.push({ label: event.group, events: [event] });
    }

    return out;
}

export function PreferenceMatrix({
    events,
    channels,
    value,
    onChange,
    disabled = false,
    labels = preferenceMatrixLabels,
}: {
    events: PreferenceEvent[];
    channels: PreferenceChannel[];
    value: PreferenceValue;
    onChange: (value: PreferenceValue) => void;
    disabled?: boolean;
    labels?: PreferenceMatrixLabels;
}) {
    const uid = useId();
    const set = (event: string, channel: string, enabled: boolean) => onChange({ ...value, [event]: { ...value[event], [channel]: enabled } });

    return (
        <section className="rounded-lg glass">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th scope="col" className="px-5 py-3 text-start text-xs font-medium text-muted-foreground">
                                {labels.event}
                            </th>
                            {channels.map((channel) => (
                                <th key={channel.key} scope="col" className="w-28 px-3 py-3 text-center text-xs font-medium text-muted-foreground" title={channel.available === false ? channel.unavailableHint : undefined}>
                                    {channel.label}
                                    {channel.available === false && channel.unavailableHint && (
                                        <span id={`${uid}-${channel.key}-hint`} className="sr-only">
                                            {channel.unavailableHint}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {groupsOf(events).map((group) => (
                        <tbody key={group.label ?? group.events[0].key}>
                            {group.label && (
                                <tr className="border-b border-border bg-muted/40">
                                    <th colSpan={channels.length + 1} scope="colgroup" className="px-5 py-2 text-start text-xs font-semibold text-foreground">
                                        {group.label}
                                    </th>
                                </tr>
                            )}
                            {group.events.map((event) => (
                                <tr key={event.key} className="border-b border-border last:border-0">
                                    <th scope="row" className="px-5 py-3 text-start font-normal">
                                        <span className="block font-medium text-foreground">{event.label}</span>
                                        {event.hint && <span className="block text-xs text-muted-foreground">{event.hint}</span>}
                                    </th>
                                    {channels.map((channel) => (
                                        <td key={channel.key} className={cn('px-3 py-3 text-center', channel.available === false && 'opacity-50')}>
                                            <Switch
                                                aria-label={`${event.label}: ${channel.label}`}
                                                aria-describedby={channel.available === false && channel.unavailableHint ? `${uid}-${channel.key}-hint` : undefined}
                                                checked={value[event.key]?.[channel.key] ?? false}
                                                disabled={disabled || channel.available === false}
                                                onCheckedChange={(enabled) => set(event.key, channel.key, enabled)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    ))}
                </table>
            </div>
            {labels.quietHours && <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">{labels.quietHours}</p>}
        </section>
    );
}
