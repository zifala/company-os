import type { DocEntry } from '../types';

export const localeSwitch: DocEntry = {
    slug: 'locale-switch',
    name: 'LocaleSwitch',
    category: 'shell',
    pieces: [18],
    tagline: 'A globe with the current language code. Pick another and the page reloads in it.',
    job: 'Switch the interface language in one click from any page.',
    tags: ['locale', 'language', 'bilingual', 'i18n', 'switch'],
    exports: ['LocaleSwitch', 'LocaleOption'],
    files: ['components/company-os/locale-switch.tsx'],
    shadcnDeps: ['button', 'dropdown-menu'],
    intro: [
        'A ghost button showing the current code in uppercase, a dropdown listing each locale by its own name with a check on the active one. <code>onChange(value)</code> is the page\'s: post the locale route, store it on the user, reload. The component holds no state.',
        'Bilingual from day one. Two locales in the header is the normal case; the list is data so a third costs nothing.',
    ],
    examples: [
        {
            title: 'English and Somali',
            demoKey: 'locale-switch',
            code: `import { LocaleSwitch } from '@/components/company-os';

<LocaleSwitch
  locales={[{ value: 'en', label: 'English' }, { value: 'so', label: 'Soomaali' }]}
  current={locale}
  onChange={(value) => router.post(localeRoute.update(), { locale: value }, { preserveScroll: true })}
/>`,
        },
    ],
    props: [
        {
            component: 'LocaleSwitch',
            rows: [
                { name: 'locales', type: 'LocaleOption[]', description: '<code>{ value, label }</code>. Label in that language.' },
                { name: 'current', type: 'string', description: 'Active locale code.' },
                { name: 'onChange', type: '(value: string) => void', description: 'The page persists and reloads.' },
                { name: 'label', type: 'string', defaultValue: "'Language'", description: '<code>aria-label</code> of the button.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Enter / Space', action: 'Open the list.' },
            { keys: '↑ ↓ Enter', action: 'Pick a language.' },
        ],
        notes: [
            'The button names itself "Language" plus the visible code; each option is its language name in that language.',
            'The active option carries a check icon; the label is the information.',
        ],
    },
    donts: [
        'No flags. A language is not a country.',
        'No locale stored only in the browser. The user row keeps it so mail and the app agree.',
        'No native <code>&lt;select&gt;</code>.',
    ],
    faq: [
        { q: 'Where does the translated copy come from?', a: '<code>lang/en</code> and <code>lang/so</code> on the server, shared to the page. Components take copy as props.' },
    ],
};
