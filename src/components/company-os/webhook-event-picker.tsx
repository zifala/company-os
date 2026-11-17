import { Checkbox } from '@/components/ui/checkbox';

export type WebhookEvent = {
    name: string;
    label: string;
};

export type WebhookEventGroup = {
    key: string;
    label: string;
    events: WebhookEvent[];
};

export type WebhookEventPickerLabels = {
    all: (group: string) => string;
    count: (selected: number, total: number) => string;
};

export const webhookEventPickerLabels: WebhookEventPickerLabels = {
    all: (group) => `All ${group.toLowerCase()} events`,
    count: (selected, total) => `${selected} of ${total}`,
};

export function WebhookEventPicker({
    groups,
    value,
    onChange,
    disabled = false,
    labels: custom,
}: {
    groups: WebhookEventGroup[];
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
    labels?: Partial<WebhookEventPickerLabels>;
}) {
    const labels = { ...webhookEventPickerLabels, ...custom };
    const on = new Set(value);

    const toggleGroup = (group: WebhookEventGroup, checked: boolean) => {
        const names = group.events.map((event) => event.name);
        onChange(checked ? [...new Set([...value, ...names])] : value.filter((name) => !names.includes(name)));
    };

    return (
        <div className="grid gap-3">
            {groups.map((group) => {
                const selected = group.events.filter((event) => on.has(event.name)).length;
                const all = selected === group.events.length;
                const groupId = `webhook-group-${group.key}`;

                return (
                    <fieldset key={group.key} className="rounded-md border border-border">
                        <legend className="sr-only">{group.label}</legend>
                        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-3 py-2">
                            <Checkbox
                                id={groupId}
                                checked={all ? true : selected > 0 ? 'indeterminate' : false}
                                disabled={disabled}
                                onCheckedChange={(checked) => toggleGroup(group, checked === true)}
                                aria-label={labels.all(group.label)}
                            />
                            <label htmlFor={groupId} className="text-sm font-medium text-slate-800">
                                {group.label}
                            </label>
                            <span className="ml-auto text-xs text-muted-foreground tabular-nums">{labels.count(selected, group.events.length)}</span>
                        </div>
                        <ul className="grid gap-x-4 gap-y-2 p-3 sm:grid-cols-2">
                            {group.events.map((event) => {
                                const id = `webhook-event-${event.name}`;

                                return (
                                    <li key={event.name} className="flex items-start gap-2">
                                        <Checkbox
                                            id={id}
                                            checked={on.has(event.name)}
                                            disabled={disabled}
                                            onCheckedChange={(checked) => onChange(checked === true ? [...value, event.name] : value.filter((name) => name !== event.name))}
                                        />
                                        <label htmlFor={id} className="grid gap-0.5 text-sm leading-none">
                                            <span className="text-slate-800">{event.label}</span>
                                            <span className="font-mono text-xs text-muted-foreground">{event.name}</span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </fieldset>
                );
            })}
        </div>
    );
}
