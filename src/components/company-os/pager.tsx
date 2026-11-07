import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';

export type PagerLabels = { previous: string; next: string };

const defaultLabels: PagerLabels = { previous: 'Previous page', next: 'Next page' };

function PageButton({ href, label }: { href: string | null; label: string }) {
    return (
        <Button variant="outline" size="sm" disabled={!href} asChild={!!href}>
            {href ? (
                <Link href={href} preserveScroll>
                    {label}
                </Link>
            ) : (
                <span>{label}</span>
            )}
        </Button>
    );
}

export function Pager({
    prev,
    next,
    labels = defaultLabels,
}: {
    prev: string | null;
    next: string | null;
    labels?: PagerLabels;
}) {
    return (
        <div className="flex items-center gap-2">
            <PageButton href={prev} label={labels.previous} />
            <PageButton href={next} label={labels.next} />
        </div>
    );
}
