import type { Category } from './types';

export const categories: { id: Category; label: string; note: string }[] = [
    { id: 'shell', label: 'Shell', note: 'Sidebar · header · palette · bell' },
    { id: 'page-kit', label: 'Page kit', note: 'Header · filters · table · cells · states' },
    { id: 'dialogs', label: 'Dialogs', note: 'Confirm · reason · form' },
    { id: 'forms', label: 'Forms', note: 'Fields · phone · password · remote pick' },
    { id: 'access', label: 'Access & notifications', note: 'Permissions · scopes · switches · channels' },
    { id: 'views', label: 'Views & data', note: 'Saved views · favorites · import · export · print' },
    { id: 'organization', label: 'Organization', note: 'Audit · workspace · webhooks · grants · calendar feed' },
    { id: 'setup', label: 'Setup & lifecycle', note: 'Checklist · onboarding · stepper · insights' },
];
