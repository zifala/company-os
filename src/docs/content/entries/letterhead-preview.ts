import type { DocEntry } from '../types';

export const letterheadPreview: DocEntry = {
    slug: 'letterhead-preview',
    name: 'LetterheadPreview',
    category: 'organization',
    pieces: [7, 17],
    tagline: 'The printed header, live beside the workspace form: legal name, lines, logo.',
    job: 'Let the person editing the letterhead see what every invoice and statement will print.',
    tags: ['letterhead', 'workspace', 'print', 'legal name', 'logo'],
    exports: ['LetterheadPreview', 'letterheadPreviewLabels', 'LetterheadPreviewLabels'],
    files: ['components/company-os/letterhead-preview.tsx'],
    registryDeps: ['print-sheet'],
    intro: [
        'Takes the same <code>Letterhead</code> the PrintSheet reads, so the workspace page and the print layout cannot drift. Ink on paper, outside the theme, like the sheet itself.',
        'Blank lines are dropped, so an empty tax number does not print an empty row.',
    ],
    examples: [
        {
            title: 'In the workspace side column',
            demoKey: 'letterhead-preview-basic',
            code: `import { LetterheadPreview } from '@/components/company-os';

<LetterheadPreview letterhead={{ legalName: form.data.legal_name, lines: [form.data.address, form.data.registration], logo }} />`,
        },
    ],
    props: [
        {
            component: 'LetterheadPreview',
            rows: [
                { name: 'letterhead', type: 'Letterhead', description: '<code>{ legalName, lines, logo? }</code> — the PrintSheet type.' },
                { name: 'labels', type: 'Partial<LetterheadPreviewLabels>', description: 'Card title and hint.' },
            ],
        },
    ],
    a11y: { notes: ['The paper is decorative; the fields beside it are the source of truth.'] },
    donts: ['No second letterhead type. Reuse the PrintSheet one.', 'No hardcoded company name in the print layout. It reads WorkspaceSetting::current().'],
    faq: [{ q: 'Where does the logo come from?', a: 'The workspace singleton\'s media collection. Pass the rendered img as logo.' }],
};
