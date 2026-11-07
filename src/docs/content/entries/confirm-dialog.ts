import type { DocEntry } from '../types';

export const confirmDialog: DocEntry = {
    slug: 'confirm-dialog',
    name: 'ConfirmDialog',
    category: 'dialogs',
    pieces: [14, 16],
    tagline: 'Title, one sentence of consequence, Keep it, and a button that names the verb. For the light status changes.',
    job: 'Stop a one-click state change long enough to read what it does.',
    tags: ['dialog', 'confirm', 'status', 'archive', 'restore', 'destructive'],
    exports: ['ConfirmDialog', 'ConfirmDialogProps'],
    files: ['components/company-os/confirm-dialog.tsx', 'hooks/use-controllable-open.ts'],
    shadcnDeps: ['button', 'dialog'],
    intro: [
        'Archive, restore, pause, resume, complete: verbs with no reason go through this. The page owns the request: <code>onConfirm</code> fires the Inertia visit, <code>processing</code> disables the button, <code>error</code> shows the server\'s first message under the text, and the page closes the dialog on success. Nothing posts from inside.',
        'Works with a <code>trigger</code> or fully controlled from a menu item (<code>open</code> + <code>onOpenChange</code>, dialog rendered outside the menu). The confirm button is destructive by default; pass <code>destructive={false}</code> for archive-like verbs.',
    ],
    examples: [
        {
            title: 'Archive',
            description: 'The demo waits 800 ms, then closes and toasts.',
            demoKey: 'confirm-dialog',
            code: `import { ConfirmDialog } from '@/components/company-os';
import { router } from '@inertiajs/react';
import companies from '@/routes/companies';

const [open, setOpen] = useState(false);
const [processing, setProcessing] = useState(false);
const [error, setError] = useState<string>();

const archive = () =>
  router.post(companies.archive(company.id).url, {}, {
    preserveScroll: true,
    onStart: () => setProcessing(true),
    onFinish: () => setProcessing(false),
    onSuccess: () => setOpen(false),
    onError: (errors) => setError(Object.values(errors)[0]),
  });

<ConfirmDialog
  trigger={<Button variant="outline">{t('Archive company')}</Button>}
  open={open}
  onOpenChange={setOpen}
  title={t('Archive :name', { name: company.name })}
  consequence={t('The company leaves every list. Its invoices and history stay. Restore from Trash within 30 days.')}
  confirmLabel={t('Archive company')}
  destructive={false}
  processing={processing}
  error={error}
  onConfirm={archive}
/>`,
        },
    ],
    props: [
        {
            component: 'ConfirmDialog',
            rows: [
                { name: 'trigger', type: 'ReactNode', description: 'Optional opener. Omit when a menu item controls <code>open</code>.' },
                { name: 'open · onOpenChange', type: 'boolean · (open) => void', description: 'Controlled state. Uncontrolled when both are omitted.' },
                { name: 'title', type: 'string', description: 'Verb + object name: "Archive Halcyon Freight".' },
                { name: 'consequence', type: 'string', description: 'One sentence: what happens, what stays.' },
                { name: 'confirmLabel', type: 'string', description: 'Verb + object: "Archive company". Never "Confirm" or "Yes".' },
                { name: 'cancelLabel', type: 'string', defaultValue: "'Keep it'", description: 'The safe exit.' },
                { name: 'destructive', type: 'boolean', defaultValue: 'true', description: 'Rose button. False for archive, pause, complete.' },
                { name: 'processing', type: 'boolean', defaultValue: 'false', description: 'Disables the confirm button while the request runs.' },
                { name: 'error', type: 'string', description: 'Server message shown under the consequence.' },
                { name: 'onConfirm', type: '() => void', description: 'The page sends the request.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Tab', action: 'Keep it, then the verb button.' },
            { keys: 'Esc', action: 'Close without acting.' },
        ],
        notes: [
            'Radix Dialog: focus trapped, title and description wired to the dialog, focus returns to the trigger.',
            'The error line is plain text next to the description, read in order.',
        ],
    },
    donts: [
        'No request inside the dialog. The page posts and closes.',
        'No generic <code>PATCH { status }</code>. One route and one Action per verb.',
        'No "Confirm", "OK", "Yes". The button says the verb and the object.',
        'No dialog inside <code>DropdownMenuContent</code>. Lift it out and control <code>open</code>.',
        'No reason-less dialog for reject, disable, revoke or delete. Those use ReasonDialog.',
    ],
    faq: [
        { q: 'Which verbs?', a: 'Archive, restore, pause, resume, complete, a boolean toggle in a setup table. Anything someone may later ask "why" about goes through ReasonDialog.' },
        { q: 'Where does the trigger show?', a: 'Only when the response carries <code>can.&lt;verb&gt;</code> true. The policy decides; React hides.' },
    ],
};
