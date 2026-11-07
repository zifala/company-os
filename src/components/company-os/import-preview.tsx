import { FileSpreadsheetIcon } from 'lucide-react';
import { EmptyState } from '@/components/company-os/empty-state';
import { Pill } from '@/components/company-os/pill';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type ImportRowView = {
    line: number;
    name: string;
    detail: string | null;
    note: string | null;
    warnings: string[];
};

export type ImportPreview = Record<'creates' | 'updates' | 'duplicates' | 'invalid', ImportRowView[]>;

export type ImportPreviewLabels = {
    creates: string;
    updates: string;
    duplicates: string;
    invalid: string;
    line: string;
    name: string;
    note: string;
    emptyTitle: string;
    emptyMessage: string;
};

export const importPreviewLabels: ImportPreviewLabels = {
    creates: 'New',
    updates: 'Updates',
    duplicates: 'Skipped',
    invalid: 'Rows with errors',
    line: 'Line',
    name: 'Name',
    note: 'Note',
    emptyTitle: 'No rows found',
    emptyMessage: 'The file has a header but no rows under it.',
};

const sections: { key: keyof ImportPreview; color: string }[] = [
    { key: 'creates', color: 'emerald' },
    { key: 'updates', color: 'indigo' },
    { key: 'duplicates', color: 'cyan' },
    { key: 'invalid', color: 'rose' },
];

export function ImportPreviewSection({
    preview,
    detailLabel,
    labels = importPreviewLabels,
}: {
    preview: ImportPreview;
    detailLabel: string;
    labels?: ImportPreviewLabels;
}) {
    if (sections.every(({ key }) => preview[key].length === 0)) {
        return <EmptyState icon={FileSpreadsheetIcon} title={labels.emptyTitle} message={labels.emptyMessage} />;
    }

    return (
        <div className="grid gap-6">
            {sections
                .filter(({ key }) => preview[key].length > 0)
                .map(({ key, color }) => (
                    <section key={key} className="rounded-lg glass">
                        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                            <h2 className="text-sm font-semibold text-slate-800">{labels[key]}</h2>
                            <Pill name={String(preview[key].length)} color={color} />
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">{labels.line}</TableHead>
                                    <TableHead>{labels.name}</TableHead>
                                    <TableHead>{detailLabel}</TableHead>
                                    <TableHead>{labels.note}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preview[key].map((row) => (
                                    <TableRow key={row.line}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{row.line}</TableCell>
                                        <TableCell className="font-medium text-slate-800">{row.name || '—'}</TableCell>
                                        <TableCell>{row.detail ?? '—'}</TableCell>
                                        <TableCell className={key === 'invalid' ? 'text-rose-600' : 'text-muted-foreground'}>
                                            {row.note}
                                            {row.warnings.map((warning) => (
                                                <span key={warning} className="block text-xs text-rose-600">
                                                    {warning}
                                                </span>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                ))}
        </div>
    );
}
