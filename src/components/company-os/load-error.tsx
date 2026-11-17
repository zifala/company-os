import { Button } from '@/components/ui/button';
import { reload } from '@/lib/navigation';

export function LoadError({
    noun,
    prop,
    onRetry,
    message,
    label,
}: {
    noun: string;
    prop?: string;
    onRetry?: () => void;
    message?: string;
    label?: string;
}) {
    const retry = onRetry ?? (() => reload(prop ? { only: [prop] } : {}));

    return (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {message ?? `The ${noun} did not load.`}
            <Button type="button" size="sm" variant="outline" onClick={retry}>
                {label ?? `Load ${noun} again`}
            </Button>
        </div>
    );
}
