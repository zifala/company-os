import type { DocEntry } from '../types';

export const formLayout: DocEntry = {
    slug: 'form-layout',
    name: 'FormLayout',
    category: 'page-kit',
    pieces: [20],
    tagline: 'The full-page form: sticky header with Cancel and Save, section cards left, small fixed-field cards right.',
    job: 'Lay out a create or edit page with more than five fields.',
    tags: ['form', 'create page', 'edit page', 'sections', 'layout'],
    exports: ['FormLayout', 'FormSection'],
    files: ['components/company-os/form-layout.tsx'],
    registryDeps: ['page-header'],
    intro: [
        'Five fields or fewer go in a dialog. More get a page: the PageHeader sticks to the top with Cancel and Create / Save as its actions, never a footer bar. The body is big <b>FormSection</b> cards on the left, one per section, each named by a single title and no explanation text. Fields that stay the same per record (plan, language, identity, finance, source) sit in small cards on the right, like an editor\'s side panel.',
        'Validation lives in Laravel; the page shows server errors through <b>FieldRow</b>. The form element and <code>&lt;Form&gt;</code> wiring stay in the page.',
    ],
    examples: [
        {
            title: 'Create page',
            demoKey: 'form-layout-create',
            code: `import { FormLayout, FormSection, FieldRow, FormCancel } from '@/components/company-os';

<Form {...projects.store.form()}>
  {({ errors, processing }) => (
    <FormLayout
      title="Create project"
      actions={<><FormCancel href={projects.index()} /><Button disabled={processing}>Create project</Button></>}
      side={
        <FormSection compact title="Client">
          <FieldRow id="company" label="Company" error={errors.company_id}><Combobox … /></FieldRow>
        </FormSection>
      }
    >
      <FormSection title="Project">
        <FieldRow id="name" label="Name" error={errors.name}><Input id="name" name="name" /></FieldRow>
        <FieldRow id="key" label="Key" error={errors.key} hint="Two to four letters, used in task references"><Input id="key" name="key" /></FieldRow>
      </FormSection>
    </FormLayout>
  )}
</Form>`,
        },
    ],
    props: [
        {
            component: 'FormLayout',
            rows: [
                { name: 'title', type: 'string', description: 'The page title: "Create project", "Edit project".' },
                { name: 'actions', type: 'ReactNode', description: 'Cancel then the primary, right-aligned, sticky.' },
                { name: 'side', type: 'ReactNode', description: 'Small cards for fixed fields.' },
                { name: 'children', type: 'ReactNode', description: 'The section cards.' },
            ],
        },
        {
            component: 'FormSection',
            rows: [
                { name: 'title', type: 'string', description: 'One title, no description.' },
                { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'One column; the shape of a side card.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'One <code>&lt;h1&gt;</code> in the header, one <code>&lt;h2&gt;</code> per section.',
            'The primary button is a submit button inside the page\'s form; Enter submits.',
        ],
    },
    donts: [
        'No actions at the bottom of the page.',
        'No description text under a section title.',
        'No Escape-to-cancel on a full page.',
        'No status field in an edit form; status changes go through their own verb and dialog.',
    ],
    faq: [{ q: 'Fewer than six fields?', a: 'FormDialog.' }],
};
