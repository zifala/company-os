import { CheckIcon, CopyIcon, KeyRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type SecretRevealLabels = {
    copy: string;
    copied: string;
    once: string;
};

export const secretRevealLabels: SecretRevealLabels = {
    copy: 'Copy',
    copied: 'Copied',
    once: 'Copy it now. It is shown once; after you leave this page only a new one can replace it.',
};

export function SecretReveal({
    id = 'secret-reveal',
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
    const [copied, setCopied] = useState(false);

    const copy = () => {
        if (onCopy) {
            onCopy(value);
        } else {
            void navigator.clipboard?.writeText(value);
        }
        setCopied(true);
    };

    return (
        <div className="grid gap-2 rounded-lg border border-warning/40 bg-warning/5 p-4">
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <KeyRoundIcon className="size-4 text-warning" aria-hidden />
                {label}
            </label>
            <div className="flex gap-2">
                <Input
                    id={id}
                    readOnly
                    value={value}
                    aria-describedby={`${id}-once`}
                    className="font-mono text-xs"
                    onFocus={(event) => event.currentTarget.select()}
                />
                <Button type="button" variant="outline" onClick={copy}>
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? labels.copied : labels.copy}
                </Button>
            </div>
            <p id={`${id}-once`} className="text-xs text-muted-foreground">
                {hint ?? labels.once}
            </p>
        </div>
    );
}
