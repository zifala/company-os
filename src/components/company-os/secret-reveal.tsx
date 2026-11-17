import { CheckIcon, CopyIcon, KeyRoundIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type SecretRevealLabels = {
    copy: string;
    copied: string;
    copyFailed: string;
    once: string;
};

export const secretRevealLabels: SecretRevealLabels = {
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy did not work. The value is selected: press Ctrl+C or ⌘C.',
    once: 'Copy it now. It is shown once; after you leave this page only a new one can replace it.',
};

export function SecretReveal({
    id: customId,
    label,
    value,
    hint,
    onCopy,
    labels: custom,
}: {
    id?: string;
    label: string;
    value: string;
    hint?: string;
    onCopy?: (value: string) => void;
    labels?: Partial<SecretRevealLabels>;
}) {
    const labels = { ...secretRevealLabels, ...custom };
    const fallbackId = useId();
    const id = customId ?? fallbackId;
    const input = useRef<HTMLInputElement>(null);
    const timer = useRef<number | undefined>(undefined);
    const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const settle = (next: 'copied' | 'failed') => {
        setCopy(next);
        window.clearTimeout(timer.current);
        if (next === 'copied') timer.current = window.setTimeout(() => setCopy('idle'), 2000);
        else input.current?.select();
    };

    const run = () => {
        if (onCopy) {
            onCopy(value);
            settle('copied');
        } else if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(value).then(
                () => settle('copied'),
                () => settle('failed'),
            );
        } else {
            settle('failed');
        }
    };

    return (
        <div className="grid gap-2 rounded-lg border border-warning/40 bg-warning/5 p-4">
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <KeyRoundIcon className="size-4 text-warning" aria-hidden />
                {label}
            </label>
            <div className="flex gap-2">
                <Input
                    ref={input}
                    id={id}
                    readOnly
                    value={value}
                    aria-describedby={`${id}-once`}
                    className="font-mono text-xs"
                    onFocus={(event) => event.currentTarget.select()}
                />
                <Button type="button" variant="outline" onClick={run}>
                    {copy === 'copied' ? <CheckIcon /> : <CopyIcon />}
                    {copy === 'copied' ? labels.copied : labels.copy}
                </Button>
            </div>
            <p id={`${id}-once`} className="text-xs text-muted-foreground">
                {hint ?? labels.once}
            </p>
            <p role="status" className={copy === 'failed' ? 'text-xs text-destructive' : 'sr-only'}>
                {copy === 'failed' ? labels.copyFailed : copy === 'copied' ? labels.copied : ''}
            </p>
        </div>
    );
}
