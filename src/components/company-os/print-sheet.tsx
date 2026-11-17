import { PrinterIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export type Letterhead = {
    legalName: string;
    lines: string[];
    logo?: ReactNode;
};

export type PrintMeta = { label: string; value: string };

export type PrintSheetLabels = { print: string; hint: string };

export const printSheetLabels: PrintSheetLabels = {
    print: 'Print',
    hint: 'Print from Chrome or Edge to get page numbers. Keep the default margins.',
};

export function PrintSheet({
    letterhead,
    title,
    number,
    meta = [],
    stamp = null,
    footer,
    onPrint = () => window.print(),
    labels = printSheetLabels,
    children,
}: {
    letterhead: Letterhead;
    title: string;
    number: string;
    meta?: PrintMeta[];
    stamp?: string | null;
    footer: string[];
    onPrint?: () => void;
    labels?: PrintSheetLabels;
    children: ReactNode;
}) {
    return (
        <div className="min-h-svh bg-muted py-8 print:min-h-0 print:bg-white print:py-0">
            <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between gap-4 px-4 print:hidden">
                <p className="text-xs text-muted-foreground">{labels.hint}</p>
                <Button onClick={onPrint}>
                    <PrinterIcon /> {labels.print}
                </Button>
            </div>
            <article className="relative mx-auto min-h-[297mm] max-w-[210mm] overflow-hidden bg-white px-[16mm] py-[18mm] text-[10.5pt] leading-[1.45] text-black shadow-lg print:min-h-0 print:max-w-none print:overflow-visible print:p-0 print:shadow-none">
                {stamp && (
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[40%] -rotate-[20deg] text-center text-[64pt] font-bold tracking-widest text-black/[0.08] uppercase">
                        {stamp}
                    </div>
                )}
                <table className="w-full border-collapse">
                    <thead className="table-header-group">
                        <tr>
                            <td className="pb-[8mm]">
                                <div className="flex items-start justify-between gap-6 border-b border-black/25 pb-[4mm]">
                                    <div className="grid gap-0.5">
                                        <span className="text-[13pt] font-semibold">{letterhead.legalName}</span>
                                        {letterhead.lines.map((line, index) => (
                                            <span key={index} className="text-[9pt] text-black/65">
                                                {line}
                                            </span>
                                        ))}
                                    </div>
                                    {letterhead.logo}
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tfoot className="table-footer-group">
                        <tr>
                            <td className="pt-[8mm]">
                                <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-black/25 pt-[3mm] text-[8.5pt] text-black/65">
                                    {footer.map((line, index) => (
                                        <span key={index}>{line}</span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td className="align-top">
                                <div className="mb-[6mm] flex flex-wrap items-end justify-between gap-6">
                                    <h1 className="text-[18pt] font-semibold">
                                        {title} <span className="font-mono text-[14pt]">{number}</span>
                                    </h1>
                                    {meta.length > 0 && (
                                        <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-[9.5pt]">
                                            {meta.map((item) => (
                                                <div key={item.label} className="contents">
                                                    <dt className="text-black/65">{item.label}</dt>
                                                    <dd className="text-end tabular-nums">{item.value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    )}
                                </div>
                                <div className="grid gap-[6mm]">{children}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </div>
    );
}
