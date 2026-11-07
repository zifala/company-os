import { ListFilterIcon, SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { activeFilters, applyFilters, FilterChips } from '@/components/company-os/filter-chips';
import type { FilterState } from '@/components/company-os/filter-chips';
import { FilterControl } from '@/components/company-os/filter-control';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type FilterBarLabels = { filters: string; clearFilters: string; search: string };

const defaultLabels: FilterBarLabels = { filters: 'Filters', clearFilters: 'Clear filters', search: 'Search' };

export function FilterBar({
    state,
    end,
    labels = defaultLabels,
}: {
    state: FilterState;
    end?: ReactNode;
    labels?: FilterBarLabels;
}) {
    const inline = state.fields.filter((field) => field.inline);
    const overflow = state.fields.filter((field) => !field.inline);
    const overflowKeys = overflow.map((field) => field.key);
    const overflowActive = activeFilters(state).filter((filter) => overflowKeys.includes(filter.key)).length;

    return (
        <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {state.searchPlaceholder && (
                    <div className="relative w-full sm:w-56">
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            aria-label={labels.search}
                            className="pl-9"
                            placeholder={state.searchPlaceholder}
                            defaultValue={state.filters.search ?? ''}
                            onKeyDown={(event) =>
                                event.key === 'Enter' && applyFilters(state, { search: event.currentTarget.value })
                            }
                        />
                    </div>
                )}
                {inline.map((field) => (
                    <FilterControl key={field.key} field={field} state={state} className="w-36 shrink-0" />
                ))}
                {overflow.length > 0 && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="shrink-0">
                                <ListFilterIcon />
                                {labels.filters}
                                {overflowActive > 0 && (
                                    <span className="rounded-full bg-primary/10 px-1.5 text-xs text-primary tabular-nums">
                                        {overflowActive}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="grid gap-3">
                            {overflow.map((field) => (
                                <div key={field.key} className="grid gap-1.5">
                                    <Label className="font-light">{field.label}</Label>
                                    <FilterControl field={field} state={state} />
                                </div>
                            ))}
                        </PopoverContent>
                    </Popover>
                )}
                {end && <div className="flex flex-wrap items-center gap-2 lg:ml-auto">{end}</div>}
            </div>
            <FilterChips state={state} className="justify-start" clearLabel={labels.clearFilters} />
        </div>
    );
}
