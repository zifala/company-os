import { AlertCircleIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

export function InputError({ message }: { message?: string }) {
    return message ? <p className="text-sm text-rose-600">{message}</p> : null;
}

export function FieldRow({
    id,
    label,
    error,
    hint,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            <InputError message={error} />
        </div>
    );
}

export function AlertError({
    errors,
    title = 'The form was not saved.',
}: {
    errors: string[];
    title?: string;
}) {
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                    {Array.from(new Set(errors)).map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
}

export function FormCancel({
    href,
    onCancel,
    label = 'Cancel',
}: {
    href?: Href;
    onCancel?: () => void;
    label?: string;
}) {
    if (href) {
        return (
            <Button variant="outline" asChild>
                <Link href={href}>{label}</Link>
            </Button>
        );
    }

    if (!onCancel) {
        return null;
    }

    return (
        <Button type="button" variant="outline" onClick={onCancel}>
            {label}
        </Button>
    );
}
