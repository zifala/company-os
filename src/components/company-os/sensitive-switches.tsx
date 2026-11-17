import { Switch } from '@/components/ui/switch';

export type SensitiveSwitch = {
    key: string;
    label: string;
    hint: string;
};

export function SensitiveSwitches({
    title = 'Sensitive fields',
    switches,
    value,
    onChange,
    holds,
    disabled = false,
}: {
    title?: string;
    switches: SensitiveSwitch[];
    value: string[];
    onChange: (value: string[]) => void;
    holds: (key: string) => boolean;
    disabled?: boolean;
}) {
    const on = new Set(value);

    return (
        <section className="rounded-lg glass">
            <h2 className="border-b border-border px-5 py-3 text-sm font-semibold text-slate-800">{title}</h2>
            <ul>
                {switches.map((item) => {
                    const id = `sensitive-${item.key}`;
                    const checked = on.has(item.key);

                    return (
                        <li key={item.key} className="flex items-start gap-4 border-b border-border px-5 py-3 last:border-0">
                            <div className="min-w-0 flex-1">
                                <label htmlFor={id} className="text-sm font-medium text-slate-800">
                                    {item.label}
                                </label>
                                <p id={`${id}-hint`} className="text-xs text-muted-foreground">
                                    {item.hint}
                                </p>
                            </div>
                            <Switch
                                id={id}
                                aria-describedby={`${id}-hint`}
                                checked={checked}
                                disabled={disabled || (!checked && !holds(item.key))}
                                onCheckedChange={(next) => onChange(next ? [...value, item.key] : value.filter((key) => key !== item.key))}
                            />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
