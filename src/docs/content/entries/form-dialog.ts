import type { DocEntry } from '../types';

export const formDialog: DocEntry = {
    slug: 'form-dialog',
    name: 'FormDialog',
    category: 'dialogs',
    pieces: [25],
    tagline: 'A dialog that is a form: title, your fields, Cancel and a submit that names the object.',
    job: 'Create or rename a small record without leaving the page.',
    tags: ['dialog', 'form', 'create', 'rename', 'setup-lists', 'inline'],
    exports: ['FormDialog'],
    files: ['components/company-os/form-dialog.tsx', 'hooks/use-controllable-open.ts'],
    shadcnDeps: ['button', 'dialog'],
    intro: [
        'The shell around a <code>&lt;form&gt;</code>. The page renders <b>FieldRow</b>s as children bound to its <code>useForm</code>, passes <code>processing</code> and an <code>onSubmit</code> that posts. Enter submits, the footer has Cancel and the submit button. Setup lists (lead sources, stages, labels), rename, quick create from the New menu: anything with up to five fields.',
        'Same control pattern as the other dialogs: a <code>trigger</code>, or <code>open</code> + <code>onOpenChange</code> from a menu or the New menu. Reset the form on success, keep it on a 422 so errors sit next to their fields.',
    ],
    examples: [
        {
            title: 'Add a lead source',
            description: 'One FieldRow. The demo rejects an empty name after 600 ms.',
            demoKey: 'form-dialog',
            code: `import { FieldRow, FormDialog } from '@/components/company-os';
import { useForm } from '@inertiajs/react';
import lists from '@/routes/setup/lists';

const [open, setOpen] = useState(false);
const form = useForm({ name: '' });

const save = () =>
  form.post(lists.store('lead-sources').url, {
    preserveScroll: true,
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

<FormDialog
  trigger={<Button><PlusIcon /> {t('Add lead source')}</Button>}
  open={open}
  onOpenChange={setOpen}
  title={t('Add lead source')}
  description={t('Lead sources appear on every deal and in the pipeline report.')}
  submitLabel={t('Add lead source')}
  processing={form.processing}
  onSubmit={save}
>
  <FieldRow id="lead-source-name" label={t('Name')} error={form.errors.name}>
    <Input id="lead-source-name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
  </FieldRow>
</FormDialog>`,
        },
    ],
    props: [
        {
            component: 'FormDialog',
            rows: [
                { name: 'trigger', type: 'ReactNode', description: 'Optional opener.' },
                { name: 'open · onOpenChange', type: 'boolean · (open) => void', description: 'Controlled state.' },
                { name: 'title', type: 'string', description: 'Verb + object: "Add lead source", "Rename stage".' },
                { name: 'description', type: 'string', description: 'One sentence of context when the title is not enough.' },
                { name: 'submitLabel', type: 'string', description: 'Same verb + object as the title. Never "Submit" or "Save".' },
                { name: 'cancelLabel', type: 'string', defaultValue: "'Cancel'", description: 'Closes without posting.' },
                { name: 'processing', type: 'boolean', defaultValue: 'false', description: 'Disables the submit button.' },
                { name: 'onSubmit', type: '() => void', description: 'Called on Enter or the submit button. The page posts.' },
                { name: 'children', type: 'ReactNode', description: 'FieldRows bound to the page form.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Enter', action: 'Submit from any field.' },
            { keys: 'Tab', action: 'Fields, Cancel, submit.' },
            { keys: 'Esc', action: 'Close without posting.' },
        ],
        notes: [
            'A real <code>&lt;form&gt;</code> inside the dialog, so Enter and implicit submission work.',
            'Cancel is <code>type="button"</code>; only the submit button submits.',
            'Errors render under their fields through FieldRow, not in a summary.',
        ],
    },
    donts: [
        'No <code>useForm</code> inside. The page owns the form.',
        'No status field in the form. Status changes go through ConfirmDialog or ReasonDialog.',
        'No dialog for a form with more than five fields. That is a page.',
        'No "Save" or "Submit" label.',
    ],
    faq: [
        { q: 'Edit and create in one dialog?', a: 'Yes. Pass the record values as the form defaults and switch <code>title</code> and <code>submitLabel</code>; the post goes to store or update.' },
        { q: 'Opened from the New menu?', a: 'The menu item sets a <code>dialog</code> state; the FormDialog renders beside the menu with <code>open={dialog === \'contact\'}</code>.' },
    ],
};
