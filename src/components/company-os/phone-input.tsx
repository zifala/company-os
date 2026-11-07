import type { CountryCode } from 'libphonenumber-js';
import { AsYouType, getCountries, getCountryCallingCode, isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const DEFAULT_COUNTRY: CountryCode = 'SO';

export type PhoneLabels = { country: string; searchCountry: string; noMatch: string };

const defaultLabels: PhoneLabels = { country: 'Country code', searchCountry: 'Search country', noMatch: 'Nothing matches.' };

function split(value: string | null | undefined, fallback: CountryCode) {
    const parsed = value ? parsePhoneNumberFromString(value, fallback) : undefined;

    return parsed
        ? { country: parsed.country ?? fallback, national: parsed.formatNational() }
        : { country: fallback, national: value ?? '' };
}

export function isValidPhone(value: string | null | undefined, country: CountryCode = DEFAULT_COUNTRY): boolean {
    return !value || isValidPhoneNumber(value, country);
}

export function PhoneInput({
    id,
    value,
    onChange,
    disabled,
    invalid,
    onBlur,
    defaultCountry = DEFAULT_COUNTRY,
    locale = 'en',
    labels = defaultLabels,
}: {
    id: string;
    value: string | null | undefined;
    onChange: (value: string) => void;
    disabled?: boolean;
    invalid?: boolean;
    onBlur?: () => void;
    defaultCountry?: CountryCode;
    locale?: string;
    labels?: PhoneLabels;
}) {
    const [open, setOpen] = useState(false);
    const [initial] = useState(() => split(value, defaultCountry));
    const [country, setCountry] = useState<CountryCode>(initial.country);
    const [national, setNational] = useState(initial.national);
    const countries = useMemo(() => {
        const names = new Intl.DisplayNames([locale, 'en'], { type: 'region' });

        return getCountries()
            .map((code) => ({ code, name: names.of(code) ?? code, dial: getCountryCallingCode(code) }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [locale]);

    const emit = (nextCountry: CountryCode, nextNational: string) => {
        const digits = nextNational.replace(/\D/g, '');
        onChange(digits ? `+${getCountryCallingCode(nextCountry)}${digits.replace(/^0+/, '')}` : '');
    };

    return (
        <div
            className={cn(
                'flex h-9 w-full items-stretch rounded-lg border border-input bg-card/70 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20',
                invalid && 'border-destructive ring-destructive/20',
                disabled && 'opacity-50',
            )}
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        aria-label={labels.country}
                        className="flex shrink-0 cursor-pointer items-center gap-1 border-r border-input px-3 text-sm font-medium tabular-nums disabled:cursor-not-allowed"
                    >
                        {country} +{getCountryCallingCode(country)}
                        <ChevronDown className="size-3.5 text-slate-400" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                    <Command>
                        <CommandInput placeholder={labels.searchCountry} />
                        <CommandList>
                            <CommandEmpty>{labels.noMatch}</CommandEmpty>
                            <CommandGroup>
                                {countries.map((item) => (
                                    <CommandItem
                                        key={item.code}
                                        value={`${item.name} ${item.dial} ${item.code}`}
                                        onSelect={() => {
                                            setCountry(item.code);
                                            setOpen(false);
                                            emit(item.code, national);
                                        }}
                                    >
                                        <span className="flex-1 truncate">{item.name}</span>
                                        <span className="text-xs text-muted-foreground tabular-nums">+{item.dial}</span>
                                        <Check className={cn('text-primary', item.code === country ? 'opacity-100' : 'opacity-0')} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <input
                id={id}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                disabled={disabled}
                value={national}
                placeholder={country === DEFAULT_COUNTRY ? '61 234 5678' : ''}
                aria-invalid={invalid ? true : undefined}
                onBlur={onBlur}
                onChange={(event) => {
                    const typed = event.target.value;
                    const international = typed.trim().startsWith('+') ? parsePhoneNumberFromString(typed) : undefined;

                    if (international?.country) {
                        setCountry(international.country);
                        setNational(international.formatNational());
                        onChange(international.number);

                        return;
                    }

                    const formatted = new AsYouType(country).input(typed);
                    setNational(formatted);
                    emit(country, formatted);
                }}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm tabular-nums outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
        </div>
    );
}
