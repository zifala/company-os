import { useEffect, useRef, useState } from 'react';
import type { FoundGroup } from '@/components/company-os/command-palette-items';

export type RecordSearch = (term: string) => Promise<FoundGroup[]>;

const minLength = 2;
const debounceMs = 200;

export function useRecordSearch(onSearch?: RecordSearch) {
    const [query, setQuery] = useState('');
    const [groups, setGroups] = useState<FoundGroup[]>([]);
    const [searching, setSearching] = useState(false);
    const [failed, setFailed] = useState(false);
    const search = useRef(onSearch);

    useEffect(() => {
        search.current = onSearch;
    }, [onSearch]);

    const term = query.trim();
    const active = term.length >= minLength;

    useEffect(() => {
        if (!active) {
            return;
        }

        let cancelled = false;
        const timer = window.setTimeout(() => {
            const run = search.current;

            if (!run) {
                return;
            }

            setSearching(true);
            setFailed(false);
            run(term)
                .then((found) => {
                    if (!cancelled) {
                        setGroups(found);
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setFailed(true);
                    }
                })
                .finally(() => {
                    if (!cancelled) {
                        setSearching(false);
                    }
                });
        }, debounceMs);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [term, active]);

    const change = (value: string) => {
        setQuery(value);

        if (value.trim().length < minLength) {
            setGroups([]);
            setFailed(false);
            setSearching(false);
        }
    };

    return { query, setQuery: change, searching, groups: active ? groups : [], failed };
}
