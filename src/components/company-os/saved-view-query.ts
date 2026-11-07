import type { FilterState } from '@/components/company-os/filter-chips';

export type SavedViewItem = {
    id: string;
    name: string;
    query: Record<string, string>;
    is_shared: boolean;
    owner: string;
    can_update: boolean;
    can_delete: boolean;
};

const viewKeys = ['view', 'group', 'sort', 'page'];

export function viewDefinition(state: FilterState) {
    const { view, group, sort } = state.filters;
    const filters = Object.fromEntries(
        Object.entries(state.filters).filter(([key, value]) => !viewKeys.includes(key) && value !== ''),
    );

    return {
        layout: view ?? 'list',
        group_by: group || null,
        sort: sort || null,
        filters,
    };
}

function comparable(query: Record<string, string>, ignored: string[]) {
    return JSON.stringify(
        Object.entries(query)
            .filter(([key, value]) => value !== '' && key !== 'page' && !ignored.includes(key))
            .sort(([a], [b]) => a.localeCompare(b)),
    );
}

export function activeView(state: FilterState, views: SavedViewItem[], implied: string[] = []): SavedViewItem | undefined {
    const current = comparable(state.filters, implied);

    return views.find((view) => comparable(view.query, implied) === current);
}
