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
        <div className="flex items-center justify-between gap-4 rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            {message ?? `The ${noun} did not load.`}
            <Button size="sm" variant="outline" onClick={retry}>
                {label ?? `Load ${noun} again`}
            </Button>
        </div>
    );
}
