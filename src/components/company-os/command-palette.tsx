import { CornerDownLeftIcon } from 'lucide-react';
import { goItems, matchesTerm, paletteLabels } from '@/components/company-os/command-palette-items';
import type { PaletteItem, PaletteLabels } from '@/components/company-os/command-palette-items';
import { canSee } from '@/components/company-os/nav';
import type { NavGroup } from '@/components/company-os/nav';
import { useRecordSearch } from '@/components/company-os/use-record-search';
import type { RecordSearch } from '@/components/company-os/use-record-search';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Skeleton } from '@/components/ui/skeleton';

function PaletteGroup({
    heading,
    items,
    onRun,
}: {
    heading: string;
    items: PaletteItem[];
    onRun: (run: PaletteItem['run']) => void;
}) {
    if (items.length === 0) {
        return null;
    }

    return (
        <CommandGroup heading={heading}>
            {items.map((item) => (
                <CommandItem key={item.label} value={`${heading} ${item.label}`} onSelect={() => onRun(item.run)}>
                    <item.icon />
                    {item.label}
                    {item.shortcut && (
                        <span className="ml-auto flex gap-1">
                            {item.shortcut.split(' ').map((key) => (
                                <Kbd key={key}>{key}</Kbd>
                            ))}
                        </span>
                    )}
                </CommandItem>
            ))}
        </CommandGroup>
    );
}

export function CommandPalette({
    open,
    onOpenChange,
    placeholder = 'Search a record or type a command',
    groups,
    permissions,
    actions,
    onSearch,
    onNavigate,
    labels: custom,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    placeholder?: string;
    groups: NavGroup[];
    permissions: string[];
    actions: PaletteItem[];
    onSearch?: RecordSearch;
    onNavigate: (url: string) => void;
    labels?: Partial<PaletteLabels>;
}) {
    const labels = { ...paletteLabels, ...custom };
    const { query, setQuery, searching, groups: found, failed } = useRecordSearch(onSearch);
    const term = query.trim().toLowerCase();
    const allowedActions = matchesTerm(actions.filter((item) => canSee(item, permissions)), term);
    const allowedGoTo = matchesTerm(goItems(groups, permissions), term);

    const close = () => {
        onOpenChange(false);
        setQuery('');
    };

    const run = (target: PaletteItem['run']) => {
        close();

        if (typeof target === 'function') {
            target();
        } else {
            onNavigate(target);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
            <DialogContent className="top-24 translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl" showCloseButton={false}>
                <DialogTitle className="sr-only">{labels.title}</DialogTitle>
                <Command shouldFilter={false} loop>
                    <CommandInput autoFocus placeholder={placeholder} value={query} onValueChange={setQuery} />
                    <CommandList className="max-h-96">
                        {searching && found.length === 0 && (
                            <div className="grid gap-2 p-2">
                                <Skeleton className="h-7 rounded-md" />
                                <Skeleton className="h-7 rounded-md" />
                            </div>
                        )}
                        {failed && <p className="px-3 py-2 text-sm text-rose-600">{labels.failed}</p>}
                        {found.map((group) => (
                            <CommandGroup key={group.name} heading={group.name}>
                                {group.items.map((item) => (
                                    <CommandItem key={item.id} value={`${group.name} ${item.id}`} onSelect={() => run(item.url)}>
                                        <span className="truncate">{item.label}</span>
                                        <CornerDownLeftIcon className="ml-auto opacity-0 in-data-[selected=true]:opacity-100" />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                        <PaletteGroup heading={labels.actions} items={allowedActions} onRun={run} />
                        <PaletteGroup heading={labels.goTo} items={allowedGoTo} onRun={run} />
                        {!searching && (
                            <CommandEmpty>
                                {labels.empty} “{query.trim()}”.
                            </CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
