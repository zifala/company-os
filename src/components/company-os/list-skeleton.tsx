import { Skeleton } from '@/components/ui/skeleton';

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }, (_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
        </div>
    );
}
