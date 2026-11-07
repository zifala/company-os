import type { DocEntry } from '../types';

export const reasonDialog: DocEntry = {
    slug: 'reason-dialog',
    name: 'ReasonDialog',
    category: 'dialogs',
    pieces: [6, 14, 16],
    tagline: 'A confirm with a required reason, and a typed name for deletes. The reason lands in the audit log.',
    job: 'Make every serious change say why before it happens.',
    tags: ['dialog', 'reason', 'audit', 'delete', 'disable', 'reject', 'typed-name'],
    exports: ['ReasonDialog', 'reasonLabels', 'ReasonLabels'],
    files: ['components/company-os/reason-dialog.tsx', 'components/company-os/confirm-dialog.tsx', 'hooks/use-controllable-open.ts'],
    registryDeps: ['confirm-dialog'],
    shadcnDeps: ['button', 'dialog', 'input', 'label', 'textarea'],
    intro: [
        'Reject, send back, disable, revoke, delete, lose, cancel. Same shell as ConfirmDialog plus a <b>Reason</b> textarea and, when <code>confirmName</code> is set, a field where the user types the record\'s name. The verb button stays disabled until the reason has <code>minLength</code> characters and the name matches. Both are UX checks; <code>ReasonRequest</code> on the server is the real one.',
        'The reason is the page\'s form state: <code>reason</code> and <code>onReasonChange</code> wire to <code>useForm({ reason: \'\' })</code>, <code>errors.reason</code> shows the 422, and the page resets the form only on success so a failed post keeps the typed text. The typed name is local and clears on close.',
    ],
    examples: [
        {
            title: 'Deactivate with typed name',
            description: 'The demo rejects reasons under 10 characters the way a server would, and keeps the text.',
            demoKey: 'reason-dialog',
            code: `import { ReasonDialog } from '@/components/company-os';
import { useForm } from '@inertiajs/react';
import users from '@/routes/users';

const [open, setOpen] = useState(false);
const form = useForm({ reason: '' });

const deactivate = () =>
  form.post(users.deactivate(user.id).url, {
    preserveScroll: true,
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

<ReasonDialog
  trigger={<Button variant="destructive">{t('Deactivate user')}</Button>}
  open={open}
  onOpenChange={setOpen}
  title={t('Deactivate :name', { name: user.name })}
  consequence={t(':name loses access right away. Open work needs a successor. The audit log keeps who did this and why.', { name: user.first_name })}
  confirmLabel={t('Deactivate user')}
  confirmName={user.name}
  reason={form.data.reason}
  onReasonChange={(reason) => form.setData('reason', reason)}
  errors={form.errors}
  processing={form.processing}
  onConfirm={deactivate}
/>`,
        },
    ],
    props: [
        {
            component: 'ReasonDialog',
            rows: [
                { name: '…ConfirmDialogProps', type: '', description: 'trigger, open, onOpenChange, title, consequence, confirmLabel, cancelLabel, destructive, processing, error, onConfirm. Same meaning.' },
                { name: 'reason', type: 'string', description: 'From <code>form.data.reason</code>.' },
                { name: 'onReasonChange', type: '(reason: string) => void', description: '<code>form.setData(\'reason\', …)</code>.' },
                { name: 'errors', type: '{ reason?: string }', description: 'Pass <code>form.errors</code>. Shown under the textarea.' },
                { name: 'confirmName', type: 'string', description: 'Set for deletes. Adds "Type … to confirm"; the button waits for a match.' },
                { name: 'minLength', type: 'number', defaultValue: '3', description: 'Characters before the verb button enables. Match the request rule.' },
                { name: 'labels', type: 'Partial<ReasonLabels>', description: '<code>reason</code> and <code>typeName(name)</code>.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Tab', action: 'Reason, typed name, Keep it, the verb button.' },
            { keys: 'Esc', action: 'Close; the page keeps or resets the reason.' },
        ],
        notes: [
            'Both fields have visible <code>&lt;label&gt;</code>s; the server error sits directly under the textarea.',
            'The disabled verb button stays in the tab order so the reader learns it is not ready.',
            'The typed-name label contains the exact name to type.',
        ],
    },
    donts: [
        'No <code>useForm</code> inside the component. The page owns the form and the post.',
        'No reason in a query string or a toast. It goes in the request body and the activity row.',
        'No ReasonDialog from a table row. Serious changes start on the record\'s page.',
        'No skipped server rule. The 3-character minimum here is a courtesy.',
    ],
    faq: [
        { q: 'Why keep the text on error?', a: 'A 422 means the user wrote something the server rejected. Resetting would make them write it twice. Reset in <code>onSuccess</code> only.' },
        { q: 'Where does the reason end up?', a: 'The Action validates it and stores <code>withProperties([\'reason\' =&gt; …])</code> on the activity row. History shows who, when and why.' },
    ],
};
