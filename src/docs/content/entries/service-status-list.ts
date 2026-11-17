import type { DocEntry } from '../types';

export const serviceStatusList: DocEntry = {
    slug: 'service-status-list',
    name: 'ServiceStatusList',
    category: 'organization',
    pieces: [7, 8],
    tagline: 'Each service the app needs, configured or missing, with the env names to set. Never a value.',
    job: 'Tell an admin what the server still needs without putting a secret anywhere near the browser.',
    tags: ['services', 'env', 'configuration', 'workspace', 'setup', 'secrets'],
    exports: ['ServiceStatusList', 'serviceStatusLabels', 'ServiceStatus', 'ServiceStatusLabels'],
    files: ['components/company-os/service-status-list.tsx'],
    intro: [
        'Renders <code>ServiceStatus::rows()</code>: <code>{ key, label, ok, env }</code> from <code>config()</code>. Shown on the workspace page and inside the setup checklist.',
        'The env names tell the person who deploys what to set. The values stay on the server; the UI only ever says ok or missing.',
    ],
    examples: [
        {
            title: 'On the workspace page',
            demoKey: 'service-status-list-basic',
            code: `import { ServiceStatusList } from '@/components/company-os';

<ServiceStatusList services={services} action={<Link href={route('organization.setup')}>Open setup</Link>} />`,
        },
    ],
    props: [
        {
            component: 'ServiceStatusList',
            rows: [
                { name: 'services', type: 'ServiceStatus[]', description: '<code>{ key, label, ok, env: string[] }</code>.' },
                { name: 'action', type: 'ReactNode', description: 'Top-right of the card, e.g. a link to setup.' },
                { name: 'labels', type: 'Partial<ServiceStatusLabels>', description: 'Title, ok and missing words.' },
            ],
        },
    ],
    a11y: { notes: ['State is a word next to an icon, never colour alone.'] },
    donts: ['No secret values, masked or not.', 'No form to type a key. Secrets live in env; if one must be set in the UI it is stored encrypted and only key_changed is logged.'],
    faq: [{ q: 'Why read config() and not env()?', a: 'Config caching makes env() null in production. ServiceStatus reads config().' }],
};
