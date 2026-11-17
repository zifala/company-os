import type { DocEntry } from '../types';

export const secretReveal: DocEntry = {
    slug: 'secret-reveal',
    name: 'SecretReveal',
    category: 'organization',
    pieces: [22, 12],
    tagline: 'A secret shown once: read-only, select on focus, copy, and the line that says it will not come back.',
    job: 'Hand over a signing secret or private link exactly once, from the flash, and never from props again.',
    tags: ['secret', 'token', 'copy', 'once', 'webhook', 'calendar', 'api key'],
    exports: ['SecretReveal', 'secretRevealLabels', 'SecretRevealLabels'],
    files: ['components/company-os/secret-reveal.tsx'],
    shadcnDeps: ['button', 'input'],
    intro: [
        'The Action returns the plain value, the controller flashes it, and the page renders this box while the flash is there. Reload and it is gone: only the hash, or the encrypted column, is kept.',
        'Used by webhook endpoints (create and rotate) and the calendar feed link. Copy writes to the clipboard unless you pass <code>onCopy</code>.',
    ],
    examples: [
        {
            title: 'After creating an endpoint',
            demoKey: 'secret-reveal-basic',
            code: `import { SecretReveal } from '@/components/company-os';

{flash.webhookSecret && <SecretReveal label="Signing secret" value={flash.webhookSecret} />}`,
        },
    ],
    props: [
        {
            component: 'SecretReveal',
            rows: [
                { name: 'label', type: 'string', description: 'What the value is.' },
                { name: 'value', type: 'string', description: 'The plain secret, from the flash.' },
                { name: 'hint', type: 'string', description: 'Replaces the shown-once line.' },
                { name: 'id', type: 'string', defaultValue: 'useId()', description: 'Input id. Generated when omitted, so two on a page never collide.' },
                { name: 'onCopy', type: '(value: string) => void', description: 'Custom copy, e.g. with a toast. Without it the browser clipboard is used; if that is refused, the value is selected and the failure line shows.' },
                { name: 'labels', type: 'Partial<SecretRevealLabels>', description: 'copy, copied, copyFailed, once.' },
            ],
        },
    ],
    a11y: { notes: ['The input is labelled and described by the once line.', 'Focus selects the whole value for keyboard copy.', 'The copy result is announced through a status line; "Copied" reverts after two seconds.'] },
    donts: ['No secret in shared props, page props after the redirect, or logs.', 'No "show again" button. Rotate or reset makes a new one.'],
    faq: [{ q: 'Why not a masked field with an eye?', a: 'A mask implies the server still has the plain value to show. It does not.' }],
};
