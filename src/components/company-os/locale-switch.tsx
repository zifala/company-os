import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type LocaleOption = { value: string; label: string };

export function LocaleSwitch({
    locales,
    current,
    onChange,
    label = 'Language',
}: {
    locales: LocaleOption[];
    current: string;
    onChange: (value: string) => void;
    label?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground uppercase"
                    aria-label={label}
                >
                    <Globe className="size-4" />
                    {current}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
                {locales.map((locale) => (
                    <DropdownMenuItem key={locale.value} onSelect={() => onChange(locale.value)}>
                        {locale.label}
                        {locale.value === current && (
                            <Check className="ml-auto size-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
