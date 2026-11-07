import { applyFilters } from '@/components/company-os/filter-chips';
import type { FilterField, FilterState } from '@/components/company-os/filter-chips';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';

export function FilterControl({
    field,
    state,
    className,
}: {
    field: FilterField;
    state: FilterState;
    className?: string;
}) {
    const value = state.filters[field.key] ?? field.defaultValue ?? '';
    const set = (next: string) => applyFilters(state, { [field.key]: next });

    if (field.text) {
        return (
            <Input
                aria-label={field.label}
                placeholder={field.placeholder}
                defaultValue={value}
                className={className}
                onKeyDown={(event) => event.key === 'Enter' && set(event.currentTarget.value)}
            />
        );
    }

    return field.searchable ? (
        <Combobox
            aria-label={field.label}
            placeholder={field.placeholder}
            options={field.options ?? []}
            value={value}
            onValueChange={set}
            className={className}
        />
    ) : (
        <OptionSelect
            aria-label={field.label}
            placeholder={field.placeholder}
            options={field.options ?? []}
            value={value}
            onValueChange={set}
            className={className}
        />
    );
}
