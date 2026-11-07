import type { GoShortcut } from '@/components/company-os/nav';
import { Kbd } from '@/components/ui/kbd';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export type ShortcutGroup = {
    name: string;
    items: { keys: string[]; label: string }[];
};

export type ShellShortcutLabels = {
    anywhere: string;
    goTo: string;
    palette: string;
    search: string;
    quickCreate: string;
    help: string;
    create?: string;
};

export const shellShortcutLabels: ShellShortcutLabels = {
    anywhere: 'Anywhere',
    goTo: 'Go to',
    palette: 'Command palette',
    search: 'Search',
    quickCreate: 'Create anything',
    help: 'Show shortcuts',
};

export function shellShortcutGroups(
    goShortcuts: GoShortcut[],
    custom: Partial<ShellShortcutLabels> = {},
): ShortcutGroup[] {
    const labels = { ...shellShortcutLabels, ...custom };
    const anywhere: ShortcutGroup['items'] = [
        { keys: ['⌘', 'K'], label: labels.palette },
        { keys: ['/'], label: labels.search },
        ...(labels.create ? [{ keys: ['C'], label: labels.create }] : []),
        { keys: ['N'], label: labels.quickCreate },
        { keys: ['?'], label: labels.help },
    ];
    const goTo = goShortcuts.map((shortcut) => ({
        keys: ['G', shortcut.key.toUpperCase()],
        label: shortcut.title,
    }));

    return [
        { name: labels.anywhere, items: anywhere },
        ...(goTo.length > 0 ? [{ name: labels.goTo, items: goTo }] : []),
    ];
}

export function ShortcutHelp({
    open,
    onOpenChange,
    groups,
    title = 'Keyboard shortcuts',
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groups: ShortcutGroup[];
    title?: string;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <div className="grid gap-6 px-4 pb-6">
                    {groups.map((group) => (
                        <section key={group.name} className="grid gap-2">
                            <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                {group.name}
                            </h2>
                            {group.items.map((item) => (
                                <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                                    <span>{item.label}</span>
                                    <span className="flex shrink-0 gap-1">
                                        {item.keys.map((key) => (
                                            <Kbd key={key}>{key}</Kbd>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </section>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
