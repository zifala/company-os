import type { DocEntry } from '../types';

export const sensitiveSwitches: DocEntry = {
    slug: 'sensitive-switches',
    name: 'SensitiveSwitches',
    category: 'access',
    pieces: [5],
    tagline: 'One switch per sensitive field family, each with the line that says what it reveals.',
    job: 'Hide money, margins, salaries and client contacts per role without a permission per field.',
    tags: ['sensitive', 'switches', 'roles', 'money', 'salaries', 'access'],
    exports: ['SensitiveSwitches', 'SensitiveSwitch'],
    files: ['components/company-os/sensitive-switches.tsx'],
    shadcnDeps: ['switch'],
    intro: [
        'Sits under the PermissionPicker on the role form. The switches mirror <code>app/Enums/Sensitive.php</code>: money, cost and margin, salaries, client contacts. Off means the server strips the fields before they reach the page.',
        'Same rule as the picker: a switch the editor does not see themselves cannot be turned on, only off.',
    ],
    examples: [
        {
            title: 'Under the role form',
            demoKey: 'sensitive-switches-basic',
            code: `import { SensitiveSwitches } from '@/components/company-os';

<SensitiveSwitches
  switches={switches}
  value={form.data.sensitive}
  onChange={(sensitive) => form.setData('sensitive', sensitive)}
  holds={(key) => auth.sensitive.includes(key)}
/>`,
        },
    ],
    props: [
        {
            component: 'SensitiveSwitches',
            rows: [
                { name: 'switches', type: 'SensitiveSwitch[]', description: '<code>{ key, label, hint }</code>.' },
                { name: 'value · onChange', type: 'string[]', description: 'Keys that are on.' },
                { name: 'holds', type: '(key: string) => boolean', description: 'Whether the editor sees this family. A family they do not see can be turned off, never on.' },
                { name: 'title', type: 'string', defaultValue: "'Sensitive fields'", description: 'Card title.' },
                { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Locks every switch.' },
            ],
        },
    ],
    a11y: { notes: ['Each switch is labelled by its name and described by its hint.'] },
    donts: ['No hiding a field in React alone. The presenter drops it on the server.', 'No switch per column. Families, from the enum.'],
    faq: [{ q: 'Why not a permission?', a: 'A switch cuts across modules: money shows on deals, invoices and payments. One switch, every presenter reads it through Access::sees.' }],
};
