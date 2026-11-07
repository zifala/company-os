import {
    ActivityIcon,
    ArrowRightIcon,
    ArrowRightLeftIcon,
    CheckIcon,
    MessageSquareIcon,
    PaperclipIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    Trash2Icon,
    UserPlusIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Pill, pillTint } from '@/components/company-os/pill';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type ActivityEntry = {
    id: string;
    kind: string;
    actor: { name: string; initials: string } | null;
    action: string;
    via?: string | null;
    subject?: { label: string; url: string } | null;
    at: string;
    at_label: string;
    time_label: string;
    day_label: string;
    changes: { label: string; from: string | null; to: string | null }[];
    reason?: string | null;
};

const kinds: Record<string, { icon: LucideIcon; color: string }> = {
    created: { icon: PlusIcon, color: 'indigo' },
    updated: { icon: PencilIcon, color: 'slate' },
    completed: { icon: CheckIcon, color: 'emerald' },
    reopened: { icon: RotateCcwIcon, color: 'cyan' },
    deleted: { icon: Trash2Icon, color: 'rose' },
    commented: { icon: MessageSquareIcon, color: 'indigo' },
    assigned: { icon: UserPlusIcon, color: 'cyan' },
    moved: { icon: ArrowRightLeftIcon, color: 'slate' },
    uploaded: { icon: PaperclipIcon, color: 'cyan' },
    other: { icon: ActivityIcon, color: 'slate' },
};

export function ActivityEntryItem({
    entry,
    showSubject,
    systemLabel = 'System',
}: {
    entry: ActivityEntry;
    showSubject: boolean;
    systemLabel?: string;
}) {
    const { icon: Icon, color } = kinds[entry.kind] ?? kinds.other;

    return (
        <li className="relative flex gap-3 pb-4 last:pb-0">
            <span className={cn('relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background', pillTint(color))}>
                <Icon className="size-4" />
            </span>
            <div className="grid min-w-0 flex-1 gap-1.5 pt-1">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
                    {entry.actor && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                            {entry.actor.initials}
                        </span>
                    )}
                    <span className="font-bold text-slate-800">{entry.actor?.name ?? systemLabel}</span>
                    <span>{entry.action}</span>
                    {entry.via && <span className="text-xs text-muted-foreground">{entry.via}</span>}
                    {showSubject && entry.subject && (
                        <Link
                            href={entry.subject.url}
                            className="rounded-md bg-slate-900/5 px-1.5 font-mono text-xs text-slate-800 hover:bg-primary/10 hover:text-primary"
                        >
                            {entry.subject.label}
                        </Link>
                    )}
                    <time dateTime={entry.at} title={entry.at_label} className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {entry.time_label}
                    </time>
                </div>
                {entry.changes.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                        {entry.changes.map((change, index) =>
                            change.to !== null ? (
                                <span key={index} className="inline-flex items-center gap-1">
                                    {change.label && <span className="text-xs text-muted-foreground">{change.label}</span>}
                                    {change.from && <Pill name={change.from} />}
                                    <ArrowRightIcon className="size-3 text-slate-400" />
                                    <Pill name={change.to} color={color} />
                                </span>
                            ) : (
                                <Pill key={index} name={change.label} />
                            ),
                        )}
                    </div>
                )}
                {entry.reason && (
                    <p className="rounded-md bg-slate-900/5 px-3 py-1.5 text-sm text-muted-foreground italic">{entry.reason}</p>
                )}
            </div>
        </li>
    );
}
