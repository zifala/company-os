import { BookmarkIcon, ChevronDownIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import type { FilterState } from '@/components/company-os/filter-chips';
import { SaveViewDialog } from '@/components/company-os/save-view-dialog';
import type { SaveViewLabels } from '@/components/company-os/save-view-dialog';
import { activeView } from '@/components/company-os/saved-view-query';
import type { SavedViewItem } from '@/components/company-os/saved-view-query';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navigateWithQuery } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type SavedViewsLabels = {
    views: string;
    savedViews: string;
    empty: string;
    saveCurrent: string;
    update: (name: string) => string;
    remove: (name: string) => string;
    sharedBy: (owner: string) => string;
};

export const savedViewsLabels: SavedViewsLabels = {
    views: 'Views',
    savedViews: 'Saved views',
    empty: 'Set filters, layout and grouping, then save them here to come back in one click.',
    saveCurrent: 'Save current view',
    update: (name) => `Update “${name}”`,
    remove: (name) => `Delete “${name}”`,
    sharedBy: (owner) => `Shared by ${owner}`,
};

export function SavedViewsMenu({
    state,
    views,
    canShare,
    implied = [],
    saving,
    saveError,
    onSave,
    onUpdate,
    onDelete,
    labels = savedViewsLabels,
    dialogLabels,
}: {
    state: FilterState;
    views: SavedViewItem[];
    canShare: boolean;
    implied?: string[];
    saving: boolean;
    saveError?: string;
    onSave: (data: { name: string; shared: boolean }) => void;
    onUpdate: (view: SavedViewItem) => void;
    onDelete: (view: SavedViewItem) => void;
    labels?: SavedViewsLabels;
    dialogLabels?: SaveViewLabels;
}) {
    const [open, setOpen] = useState(false);
    // A fresh dialog per opening, so a cancelled name does not linger.
    const [session, setSession] = useState(0);
    // Close once a save finishes without an error; the page only reports request state.
    const [wasSaving, setWasSaving] = useState(saving);
    if (saving !== wasSaving) {
        setWasSaving(saving);
        if (!saving && !saveError) setOpen(false);
    }
    const active = activeView(state, views, implied);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={cn('max-w-48', active && 'text-primary')}>
                        <BookmarkIcon />
                        <span className="truncate">{active?.name ?? labels.views}</span>
                        <ChevronDownIcon className="text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="font-light">{labels.savedViews}</DropdownMenuLabel>
                    {views.length === 0 && <p className="px-2 pb-2 text-sm text-muted-foreground">{labels.empty}</p>}
                    {views.map((view) => (
                        <DropdownMenuItem
                            key={view.id}
                            className={cn(view.id === active?.id && 'bg-primary/10 text-primary')}
                            onSelect={() => navigateWithQuery(state.url, view.query, { preserveScroll: true })}
                        >
                            <span className="truncate">{view.name}</span>
                            {view.is_shared && (
                                <span className="ms-auto inline-flex" title={labels.sharedBy(view.owner)}>
                                    <UsersIcon className="size-3.5" aria-hidden />
                                    <span className="sr-only">{labels.sharedBy(view.owner)}</span>
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => {
                            setSession((value) => value + 1);
                            setOpen(true);
                        }}
                    >
                        {labels.saveCurrent}
                    </DropdownMenuItem>
                    {active?.can_update && <DropdownMenuItem onSelect={() => onUpdate(active)}>{labels.update(active.name)}</DropdownMenuItem>}
                    {active?.can_delete && (
                        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(active)}>
                            {labels.remove(active.name)}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <SaveViewDialog key={session} open={open} onOpenChange={setOpen} canShare={canShare} processing={saving} error={saveError} onSave={onSave} labels={dialogLabels} />
        </>
    );
}
