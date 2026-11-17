import type { Letterhead } from '@/components/company-os/print-sheet';

export type LetterheadPreviewLabels = {
    title: string;
    hint: string;
};

export const letterheadPreviewLabels: LetterheadPreviewLabels = {
    title: 'On printed documents',
    hint: 'Invoices, statements and letters print this header on every page.',
};

export function LetterheadPreview({ letterhead, labels: custom }: { letterhead: Letterhead; labels?: Partial<LetterheadPreviewLabels> }) {
    const labels = { ...letterheadPreviewLabels, ...custom };
    const lines = letterhead.lines.filter((line) => line.trim() !== '');

    return (
        <section className="rounded-lg glass">
            <h2 className="border-b border-border px-5 py-3 text-sm font-semibold text-slate-800">{labels.title}</h2>
            <div className="grid gap-3 p-5">
                <div className="rounded-sm bg-white p-4 text-black shadow-sm ring-1 ring-black/5" aria-label={labels.title}>
                    <div className="flex items-start justify-between gap-4 border-b border-neutral-300 pb-2">
                        <div className="grid min-w-0 gap-0.5">
                            <span className="truncate text-sm font-semibold">{letterhead.legalName || '—'}</span>
                            {lines.map((line) => (
                                <span key={line} className="truncate text-[11px] text-neutral-600">
                                    {line}
                                </span>
                            ))}
                        </div>
                        {letterhead.logo}
                    </div>
                    <div className="mt-3 grid gap-1.5" aria-hidden>
                        <span className="h-2 w-2/5 rounded-sm bg-neutral-200" />
                        <span className="h-2 w-4/5 rounded-sm bg-neutral-100" />
                        <span className="h-2 w-3/5 rounded-sm bg-neutral-100" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">{labels.hint}</p>
            </div>
        </section>
    );
}
