import type { DocEntry } from '../types';

export const remoteCombobox: DocEntry = {
    slug: 'remote-combobox',
    name: 'RemoteCombobox',
    category: 'forms',
    pieces: [20],
    tagline: 'A searchable picker whose options come from the server as you type.',
    job: 'Pick one record from a list too long to send with the page.',
    tags: ['combobox', 'search', 'picker', 'remote', 'select'],
    exports: ['RemoteCombobox', 'RemoteOption'],
    files: ['components/company-os/remote-combobox.tsx'],
    shadcnDeps: ['command', 'popover'],
    intro: [
        'Short lists (up to about seven) use the plain dropdown; longer lists that fit in the page use the Combobox; lists that do not fit use this. It calls <code>search(term)</code> after a short debounce, keeps the selected option visible while results change, and can pin <code>fixed</code> options ("Unassigned") at the top.',
        'Pickers never render a native <code>&lt;select&gt;</code>. The component owns the request timing; the page owns the request.',
    ],
    examples: [
        {
            title: 'Pick a company',
            demoKey: 'remote-combobox-basic',
            code: `import { RemoteCombobox } from '@/components/company-os';

<RemoteCombobox
  aria-label="Company"
  placeholder="Search companies"
  selected={deal.company ? { value: deal.company.id, label: deal.company.name } : null}
  search={(term) => http.get(pickers.companies({ query: { q: term } }).url)}
  onValueChange={(id) => form.setData('company_id', id)}
/>`,
        },
    ],
    props: [
        {
            component: 'RemoteCombobox',
            rows: [
                { name: 'search', type: '(term) => Promise<RemoteOption[]>', description: 'The page\'s request. Called with "" when the list opens.' },
                { name: 'selected', type: 'RemoteOption | null', description: 'Kept in the list so the current value always shows.' },
                { name: 'fixed', type: 'RemoteOption[]', description: 'Pinned first: "Unassigned", "Me".' },
                { name: 'exclude', type: 'string', description: 'A value to hide, such as the record itself.' },
                { name: 'debounceMs', type: 'number', defaultValue: '150', description: 'Wait before searching.' },
                { name: '…Combobox props', type: 'ComboboxProps', description: 'value, onValueChange, placeholder, name, disabled, aria-label.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: '↑ ↓ · Enter', action: 'Move through results and pick one.' },
            { keys: 'Esc', action: 'Closes the list.' },
        ],
        notes: ['Inherits the Combobox contract: a <code>role="combobox"</code> trigger and a listbox with a search input.'],
    },
    donts: ['No native <code>&lt;select&gt;</code>.', 'No fetching inside the component; it calls what the page gives it.', 'No full list sent with the page when a search endpoint exists.'],
    faq: [{ q: 'Create a new record from the picker?', a: 'Pass <code>onCreate</code> and <code>createLabel</code> from the Combobox props; the typed text becomes a "Create" row.' }],
};
