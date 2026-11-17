import { useEffect, useRef, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import type { ComboboxProps } from '@/components/ui/combobox';

export type RemoteOption = { value: string; label: string };

export function RemoteCombobox({
    search,
    selected = null,
    fixed = [],
    exclude,
    debounceMs = 150,
    ...props
}: {
    search: (term: string) => Promise<RemoteOption[]>;
    selected?: RemoteOption | null;
    fixed?: RemoteOption[];
    exclude?: string;
    debounceMs?: number;
} & Omit<ComboboxProps, 'options' | 'onSearchChange' | 'onOpenChange'>) {
    const [found, setFound] = useState<RemoteOption[]>([]);
    const [term, setTerm] = useState<string | null>(null);
    // The latest search without re-running the effect: an inline function would refetch on every render.
    const latestSearch = useRef(search);

    useEffect(() => {
        latestSearch.current = search;
    }, [search]);

    useEffect(() => {
        if (term === null) {
            return;
        }

        let cancelled = false;
        const timer = setTimeout(() => {
            latestSearch.current(term)
                .then((options) => {
                    if (!cancelled) setFound(options);
                })
                .catch(() => {
                    if (!cancelled) setFound([]);
                });
        }, debounceMs);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [term, debounceMs]);

    const options = [
        ...fixed,
        ...(selected ? [selected] : []),
        ...found.filter((option) => option.value !== selected?.value),
    ].filter((option) => option.value !== exclude);

    return (
        <Combobox
            {...props}
            options={options}
            onSearchChange={setTerm}
            onOpenChange={(open) => open && term === null && setTerm('')}
        />
    );
}
