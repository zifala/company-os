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
                    aria-label={`${label}: ${current}`}
                >
                    <Globe className="size-4" aria-hidden />
                    {current}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale.value}
                        role="menuitemradio"
                        aria-checked={locale.value === current}
                        onSelect={() => onChange(locale.value)}
                    >
                        {locale.label}
                        {locale.value === current && (
                            <Check className="ms-auto size-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
