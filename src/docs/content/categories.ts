import type { Category } from './types';

export const categories: { id: Category; label: string; note: string }[] = [
    { id: 'shell', label: 'Shell', note: 'Sidebar · header · palette · bell' },
    { id: 'page-kit', label: 'Page kit', note: 'Header · filters · table · cells · states' },
    { id: 'dialogs', label: 'Dialogs', note: 'Confirm · reason · form' },
    { id: 'forms', label: 'Forms', note: 'Fields · phone · password · remote pick' },
    { id: 'views', label: 'Views & data', note: 'Saved views · favorites · import · export' },
    { id: 'setup', label: 'Setup & lifecycle', note: 'Checklist · lists · onboarding · insights' },
];
