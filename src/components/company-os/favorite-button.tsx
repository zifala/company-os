import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FavoriteButton({
    saved,
    label,
    onToggle,
    processing = false,
    addLabel = (name) => `Add ${name} to favorites`,
    removeLabel = (name) => `Remove ${name} from favorites`,
}: {
    saved: boolean;
    label: string;
    onToggle: () => void;
    processing?: boolean;
    addLabel?: (name: string) => string;
    removeLabel?: (name: string) => string;
}) {
    return (
        <Button
            size="icon"
            variant="ghost"
            aria-pressed={saved}
            aria-label={addLabel(label)}
            title={saved ? removeLabel(label) : addLabel(label)}
            disabled={processing}
            onClick={onToggle}
        >
            <StarIcon className={cn(saved && 'fill-primary text-primary')} />
        </Button>
    );
}
