import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FavoriteButton({
    saved,
    label,
    onToggle,
    addLabel = (name) => `Add ${name} to favorites`,
    removeLabel = (name) => `Remove ${name} from favorites`,
}: {
    saved: boolean;
    label: string;
    onToggle: () => void;
    addLabel?: (name: string) => string;
    removeLabel?: (name: string) => string;
}) {
    return (
        <Button
            size="icon"
            variant="ghost"
            aria-pressed={saved}
            aria-label={saved ? removeLabel(label) : addLabel(label)}
            onClick={onToggle}
        >
            <StarIcon className={cn(saved && 'fill-primary text-primary')} />
        </Button>
    );
}
