import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExportButton({ href, label = 'Export' }: { href: string; label?: string }) {
    return (
        <Button asChild size="sm" variant="outline">
            <a href={href} download>
                <DownloadIcon />
                {label}
            </a>
        </Button>
    );
}
