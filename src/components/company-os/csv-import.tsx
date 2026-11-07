import { FileUpIcon } from 'lucide-react';
import { useState } from 'react';
import { InputError } from '@/components/company-os/field-row';
import { ImportPreviewSection } from '@/components/company-os/import-preview';
import type { ImportPreview, ImportPreviewLabels } from '@/components/company-os/import-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptionSelect } from '@/components/ui/option-select';

export type CsvImportLabels = {
    file: string;
    existing: string;
    skip: string;
    update: string;
    preview: string;
    import: (count: number, noun: string) => string;
};

export const csvImportLabels: CsvImportLabels = {
    file: 'CSV file',
    existing: 'Rows that already exist',
    skip: 'Skip existing',
    update: 'Update existing',
    preview: 'Preview import',
    import: (count, noun) => `Import ${count} ${noun}`,
};

export function CsvImport({
    noun,
    help,
    detailLabel,
    preview,
    processing,
    fileError,
    onPreview,
    onImport,
    labels = csvImportLabels,
    previewLabels,
}: {
    noun: string;
    help: string;
    detailLabel: string;
    preview: ImportPreview | null;
    processing: boolean;
    fileError?: string;
    onPreview: (file: File, updateExisting: boolean) => void;
    onImport: (file: File, updateExisting: boolean) => void;
    labels?: CsvImportLabels;
    previewLabels?: ImportPreviewLabels;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [previewed, setPreviewed] = useState<{ file: File; updateExisting: boolean } | null>(null);
    const [mode, setMode] = useState('skip');
    const updateExisting = mode === 'update';
    const current = preview !== null && previewed?.file === file && previewed.updateExisting === updateExisting;
    const changes = current && preview ? preview.creates.length + preview.updates.length : 0;

    return (
        <>
            <div className="max-w-2xl rounded-lg glass p-6">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="csv-file">{labels.file}</Label>
                        <Input
                            id="csv-file"
                            type="file"
                            accept=".csv,.txt,text/csv"
                            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                        />
                        <InputError message={fileError} />
                        <p className="text-sm text-muted-foreground">{help}</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>{labels.existing}</Label>
                        <OptionSelect
                            aria-label={labels.existing}
                            value={mode}
                            onValueChange={setMode}
                            options={[
                                { value: 'skip', label: labels.skip },
                                { value: 'update', label: labels.update },
                            ]}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={current ? 'outline' : 'default'}
                            disabled={file === null || processing}
                            onClick={() => {
                                if (file) {
                                    setPreviewed({ file, updateExisting });
                                    onPreview(file, updateExisting);
                                }
                            }}
                        >
                            <FileUpIcon />
                            {labels.preview}
                        </Button>
                        {current && (
                            <Button disabled={changes === 0 || processing || file === null} onClick={() => file && onImport(file, updateExisting)}>
                                {labels.import(changes, noun)}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {current && preview && <ImportPreviewSection preview={preview} detailLabel={detailLabel} labels={previewLabels} />}
        </>
    );
}
