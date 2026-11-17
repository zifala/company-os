import type { DocEntry } from '../types';

export const csvImport: DocEntry = {
    slug: 'csv-import',
    name: 'CsvImport',
    category: 'views',
    pieces: [15],
    tagline: 'Pick a file, preview what would change, then import. Nothing writes before the preview.',
    job: 'Import records from CSV with a dry run first.',
    tags: ['import', 'csv', 'preview', 'dry run', 'upload'],
    exports: ['CsvImport', 'csvImportLabels', 'CsvImportLabels', 'ImportPreviewSection', 'ImportPreview', 'ImportRowView'],
    files: ['components/company-os/csv-import.tsx', 'components/company-os/import-preview.tsx'],
    registryDeps: ['field-row', 'empty-state', 'pill'],
    shadcnDeps: ['button', 'input', 'label', 'select', 'table'],
    intro: [
        'A file field, a choice for rows that already exist (skip or update), and "Preview import". The page posts the file with <code>dry_run</code>; the server answers with a plan of <b>New</b>, <b>Updates</b>, <b>Skipped</b> and <b>Rows with errors</b>, each a table with the line number, the name, a detail column and a note. Only then does "Import N contacts" appear.',
        'The import runs through the normal Create and Update Actions, so every row is guarded and audited, with one summary event on top.',
    ],
    examples: [
        {
            title: 'Import contacts',
            demoKey: 'csv-import-basic',
            code: `import { CsvImport } from '@/components/company-os';

<CsvImport
  noun="contacts"
  help="Columns: name, email, phone, company. Header row required."
  detailLabel="Email"
  preview={importPreview}
  processing={form.processing}
  fileError={form.errors.file}
  onPreview={(file, updateExisting) => post(file, { dry_run: true, update_existing: updateExisting })}
  onImport={(file, updateExisting) => post(file, { dry_run: false, update_existing: updateExisting })}
/>`,
        },
    ],
    props: [
        {
            component: 'CsvImport',
            rows: [
                { name: 'noun', type: 'string', description: 'Plural noun for the import button.' },
                { name: 'help', type: 'string', description: 'Expected columns, one line.' },
                { name: 'detailLabel', type: 'string', description: 'Header of the preview\'s detail column.' },
                { name: 'preview', type: 'ImportPreview | null', description: 'The plan from the dry run, or null.' },
                { name: 'processing · fileError', type: 'boolean · string', description: 'Request state (disables every control) and the file error, shown under the field and set as <code>aria-invalid</code>.' },
                { name: 'onPreview · onImport', type: '(file, updateExisting) => void', description: 'The page posts with <code>forceFormData</code>. The import button shows only while the preview matches the chosen file and mode.' },
                { name: 'labels', type: 'CsvImportLabels', defaultValue: 'csvImportLabels', description: 'file, existing, skip, update, preview, import(count, noun).' },
                { name: 'previewLabels', type: 'ImportPreviewLabels', description: 'Passed to the preview tables.' },
            ],
        },
        {
            component: 'ImportPreviewSection',
            rows: [{ name: 'preview · detailLabel · labels', type: 'ImportPreview · string · ImportPreviewLabels', description: 'Standalone preview tables.' }],
        },
    ],
    a11y: { notes: ['Four real tables with headers; error notes are text, not colour alone.'] },
    donts: ['No import without a preview.', 'No invented records for unknown lookups; the row imports with a warning instead.', 'No details of a matched record the user cannot see.'],
    faq: [{ q: 'File size?', a: 'The server caps at 2 MB and 1000 rows and returns the message on <code>file</code>.' }],
};
