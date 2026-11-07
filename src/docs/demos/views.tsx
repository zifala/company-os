import type { ComponentType } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CsvImport, ExportButton, FavoriteButton, FilterBar, SavedViewsMenu } from '@/components/company-os';
import type { FilterState, ImportPreview, SavedViewItem } from '@/components/company-os';

const state: FilterState = {
    url: '/components/saved-views-menu',
    filters: { status: 'open', owner: 'ayaan' },
    fields: [
        { key: 'status', label: 'Status', inline: true, placeholder: 'All statuses', options: [{ value: 'open', label: 'Open' }, { value: 'won', label: 'Won' }] },
        { key: 'owner', label: 'Owner', inline: true, placeholder: 'Anyone', options: [{ value: 'ayaan', label: 'Ayaan Warsame' }, { value: 'hodan', label: 'Hodan Ali' }] },
    ],
};

const views: SavedViewItem[] = [
    { id: 'v1', name: 'My open deals', query: { status: 'open', owner: 'ayaan' }, is_shared: false, owner: 'Ayaan Warsame', can_update: true, can_delete: true },
    { id: 'v2', name: 'Won this quarter', query: { status: 'won', period: 'quarter' }, is_shared: true, owner: 'Hodan Ali', can_update: false, can_delete: false },
];

function SavedViewsDemo() {
    const [saving, setSaving] = useState(false);

    return (
        <FilterBar
            state={state}
            end={
                <SavedViewsMenu
                    state={state}
                    views={views}
                    canShare
                    saving={saving}
                    onSave={({ name, shared }) => {
                        setSaving(true);
                        window.setTimeout(() => {
                            setSaving(false);
                            toast.success(`View “${name}” saved${shared ? ' and shared' : ''}`);
                        }, 500);
                    }}
                    onUpdate={(view) => toast(`Would update “${view.name}”`)}
                    onDelete={(view) => toast(`Would open the confirm for “${view.name}”`)}
                />
            }
        />
    );
}

function FavoriteDemo() {
    const [saved, setSaved] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-800">Harbour terminal rollout</span>
            <FavoriteButton saved={saved} label="Harbour terminal rollout" onToggle={() => setSaved((value) => !value)} />
        </div>
    );
}

const plan: ImportPreview = {
    creates: [
        { line: 2, name: 'Saxansaxo Water', detail: 'info@saxansaxo.example', note: null, warnings: [] },
        { line: 3, name: 'Daryeel Clinic', detail: 'hello@daryeel.example', note: null, warnings: ['Unknown source "fair"; imported without it.'] },
    ],
    updates: [{ line: 4, name: 'Halcyon Freight', detail: 'ops@halcyon.example', note: 'Phone changes', warnings: [] }],
    duplicates: [{ line: 5, name: 'Halcyon Freight', detail: 'ops@halcyon.example', note: 'Repeats line 4', warnings: [] }],
    invalid: [{ line: 6, name: '', detail: 'nobody@', note: 'The name is required. The email is not valid.', warnings: [] }],
};

function CsvImportDemo() {
    const [preview, setPreview] = useState<ImportPreview | null>(null);
    const [processing, setProcessing] = useState(false);

    const run = (next: ImportPreview | null, message: string) => {
        setProcessing(true);
        window.setTimeout(() => {
            setProcessing(false);
            setPreview(next);
            toast(message);
        }, 600);
    };

    return (
        <div className="grid gap-6">
            <CsvImport
                noun="contacts"
                help="Columns: name, email, phone, source. Header row required."
                detailLabel="Email"
                preview={preview}
                processing={processing}
                onPreview={() => run(plan, 'Preview ready')}
                onImport={() => run(null, 'Imported 3 contacts')}
            />
        </div>
    );
}

export const viewDemos: Record<string, ComponentType> = {
    'saved-views-menu-basic': SavedViewsDemo,
    'favorite-button-basic': FavoriteDemo,
    'export-button-basic': () => <ExportButton href="#" />,
    'csv-import-basic': CsvImportDemo,
};
