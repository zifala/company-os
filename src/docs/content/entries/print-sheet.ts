import type { DocEntry } from '../types';

export const printSheet: DocEntry = {
    slug: 'print-sheet',
    name: 'PrintSheet',
    category: 'views',
    pieces: [17],
    tagline: 'The A4 sheet: letterhead, repeating header and footer, title and number, lines, totals, the stamp.',
    job: 'Give every official document one print layout that the browser turns into a PDF.',
    tags: ['print', 'pdf', 'a4', 'invoice', 'statement', 'letterhead'],
    exports: ['PrintSheet', 'printSheetLabels', 'Letterhead', 'PrintMeta', 'PrintSheetLabels', 'PrintLines', 'PrintTotals', 'PrintBlock', 'PrintColumn', 'PrintRow', 'PrintTotal'],
    files: ['components/company-os/print-sheet.tsx', 'components/company-os/print-lines.tsx'],
    shadcnDeps: ['button'],
    intro: [
        'In a product the print route is Blade: <code>resources/views/print/layout.blade.php</code>, no bundle, prints at once. This component is the same structure in React, for previews and as the reference the Blade view copies: a frame table whose <code>thead</code> and <code>tfoot</code> repeat on every page, a toolbar that hides when printing, a faint stamp for draft or void.',
        'Print is ink on paper, so the sheet uses black, white and grey hairlines, not the theme. <code>PrintLines</code>, <code>PrintTotals</code> and <code>PrintBlock</code> never split across a page.',
    ],
    examples: [
        {
            title: 'Draft invoice',
            demoKey: 'print-sheet-basic',
            code: `import { PrintLines, PrintSheet, PrintTotals } from '@/components/company-os';

<PrintSheet letterhead={workspace.letterhead} title={t('Invoice')} number={invoice.number} meta={invoice.meta} stamp={invoice.stamp} footer={invoice.footer}>
  <PrintLines columns={columns} rows={invoice.lines} />
  <PrintTotals totals={invoice.totals} />
</PrintSheet>`,
        },
    ],
    props: [
        {
            component: 'PrintSheet',
            rows: [
                { name: 'letterhead', type: 'Letterhead', description: '<code>{ legalName, lines, logo? }</code> from workspace settings. Nothing hardcoded.' },
                { name: 'title · number', type: 'string', description: 'Document name and number.' },
                { name: 'meta', type: 'PrintMeta[]', description: 'Issued, due, terms. Formatted on the server.' },
                { name: 'stamp', type: 'string | null', defaultValue: 'null', description: 'Draft or void; null when final.' },
                { name: 'footer', type: 'string[]', description: 'Legal name, printed at and by, document number.' },
                { name: 'onPrint · labels', type: '() => void · PrintSheetLabels', description: 'Defaults to window.print(); print, hint.' },
            ],
        },
        {
            component: 'PrintLines · PrintTotals · PrintBlock',
            rows: [
                { name: 'columns · rows', type: 'PrintColumn[] · PrintRow[]', description: '<code>{ key, label, numeric?, width? }</code> and <code>{ id, cells }</code>. Numeric columns right-align with tabular figures.' },
                { name: 'totals', type: 'PrintTotal[]', description: '<code>{ label, value, strong? }</code>. Strong gets the rule above.' },
                { name: 'title · children', type: 'string · ReactNode', description: 'A small labelled block: bill to, pay to, signatures.' },
            ],
        },
    ],
    a11y: { notes: ['The stamp is aria-hidden; the status lives in the text.', 'The toolbar and the back button hide under print media.'] },
    donts: ['No PDF package until an attachment or archive needs one. Then one renderer takes this same layout.', 'No brand fills on paper.', 'No audit row or state change on print. Issue and send are their own Actions.'],
    faq: [{ q: 'Page numbers?', a: '@page margin boxes in the Blade view. Chromium prints them; tell users to print from Chrome or Edge.' }],
};
