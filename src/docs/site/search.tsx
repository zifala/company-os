import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type Item = { id: string; group: string; label: string; hint?: string; href: string; keywords?: string };

const pages: Item[] = [
    { id: 'home', group: 'Pages', label: 'Introduction', href: '/' },
    { id: 'standard', group: 'Pages', label: 'Standard', href: '/standard', hint: '27 pieces' },
    { id: 'components', group: 'Pages', label: 'Components', href: '/components' },
    { id: 'blocks', group: 'Pages', label: 'Blocks', href: '/blocks' },
    { id: 'templates', group: 'Pages', label: 'Templates', href: '/templates' },
    { id: 'ai', group: 'Pages', label: 'AI-ready', href: '/ai', hint: 'llms.txt' },
    { id: 'roadmap', group: 'Pages', label: 'Roadmap', href: '/roadmap' },
];

async function loadItems(): Promise<Item[]> {
    const [{ entries }, { pieces }, { compositions }] = await Promise.all([
        import('../content'),
        import('../content/pieces'),
        import('../content/compositions'),
    ]);

    return [
        ...pages,
        ...pieces.map((piece) => ({ id: `p-${piece.slug}`, group: 'Standard', label: `${piece.n}. ${piece.title}`, hint: piece.summary, href: `/pieces/${piece.slug}` })),
        ...entries.map((entry) => ({ id: `c-${entry.slug}`, group: 'Components', label: entry.name, hint: entry.job, href: `/components/${entry.slug}`, keywords: entry.tags.join(' ') })),
        ...compositions.map((comp) => ({ id: `k-${comp.slug}`, group: comp.kind === 'block' ? 'Blocks' : 'Templates', label: comp.name, hint: comp.tagline, href: comp.kind === 'block' ? '/blocks' : `/templates/${comp.slug}`, keywords: comp.tags.join(' ') })),
    ];
}

export function useSiteSearch() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((value) => !value);
            }
        };
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return { open, show: () => setOpen(true), setOpen };
}

export function SiteSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item[]>(pages);

    useEffect(() => {
        if (open && items === pages) {
            void loadItems().then(setItems);
        }
    }, [open, items]);

    const groups = [...new Set(items.map((item) => item.group))];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="top-24 translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl" showCloseButton={false}>
                <DialogTitle className="sr-only">Search the site</DialogTitle>
                <Command loop>
                    <CommandInput autoFocus placeholder="Search pieces, components, pages" />
                    <CommandList className="max-h-96">
                        <CommandEmpty>Nothing matches.</CommandEmpty>
                        {groups.map((group) => (
                            <CommandGroup key={group} heading={group}>
                                {items
                                    .filter((item) => item.group === group)
                                    .map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={`${item.label} ${item.hint ?? ''} ${item.keywords ?? ''}`}
                                            onSelect={() => {
                                                onOpenChange(false);
                                                navigate(item.href);
                                            }}
                                        >
                                            <span className="truncate">{item.label}</span>
                                            {item.hint && <span className="ml-auto max-w-56 truncate text-xs text-muted-foreground">{item.hint}</span>}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
