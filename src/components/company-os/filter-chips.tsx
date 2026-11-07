import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigateWithQuery } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type Option = { value: string; label: string };

export type FilterField = {
    key: string;
    label: string;
    options?: Option[];
    placeholder?: string;
    defaultValue?: string;
    inline?: boolean;
    searchable?: boolean;
    text?: boolean;
};

export type FilterState = {
    url: string;
    filters: Record<string, string>;
    fields: FilterField[];
    searchPlaceholder?: string;
};

export type ActiveFilter = { key: string; label: string };

export function applyFilters(
    { url, filters }: Pick<FilterState, 'url' | 'filters'>,
    changes: Record<string, string>,
) {
    const query = Object.fromEntries(
        Object.entries({ ...filters, ...changes }).filter(([, value]) => value !== ''),
    );

    navigateWithQuery(url, query, { preserveState: true, preserveScroll: true, replace: true });
}

export function activeFilters({ filters, fields }: FilterState): ActiveFilter[] {
    const search = filters.search ? [{ key: 'search', label: `“${filters.search}”` }] : [];

    return [
        ...search,
        ...fields.flatMap((field) => {
            const value = filters[field.key] ?? '';

            if (value === '' || value === (field.defaultValue ?? '')) {
                return [];
            }

            const option = field.options?.find((choice) => choice.value === value);

            return [{ key: field.key, label: `${field.label}: ${option?.label ?? value}` }];
        }),
    ];
}

export function FilterChips({
    state,
    className,
    clearLabel = 'Clear filters',
}: {
    state: FilterState;
    className?: string;
    clearLabel?: string;
}) {
    const active = activeFilters(state);

    if (active.length === 0) {
        return null;
    }

    const clearAll = Object.fromEntries(
        [...state.fields.map((field) => field.key), 'search'].map((key) => [key, '']),
    );

    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
            {active.map((filter) => (
                <span
                    key={filter.key}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-0.5 pr-1 pl-2.5 text-xs font-medium text-primary"
                >
                    {filter.label}
                    <button
                        type="button"
                        aria-label={`Remove ${filter.label}`}
                        className="rounded-full p-0.5 hover:bg-primary/15"
                        onClick={() => applyFilters(state, { [filter.key]: '' })}
                    >
                        <XIcon className="size-3" />
                    </button>
                </span>
            ))}
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => applyFilters(state, clearAll)}>
                {clearLabel}
            </Button>
        </div>
    );
}
