# FormLayout · Company OS

The full-page form: sticky header with Cancel and Save, section cards left, small fixed-field cards right.

**One job:** Lay out a create or edit page with more than five fields.
**Category:** page-kit · **Pieces:** 20 · **Exports:** FormLayout, FormSection · **Tags:** form, create page, edit page, sections, layout

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/form-layout.json
```

Manual: copy components/company-os/form-layout.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: page-header.

## Overview

Five fields or fewer go in a dialog. More get a page: the PageHeader sticks to the top with Cancel and Create / Save as its actions, never a footer bar. The body is big **FormSection** cards on the left, one per section, each named by a single title and no explanation text. Fields that stay the same per record (plan, language, identity, finance, source) sit in small cards on the right, like an editor's side panel.

Validation lives in Laravel; the page shows server errors through **FieldRow**. The form element and `<Form>` wiring stay in the page.

## Examples

### Create page

```tsx
import { FormLayout, FormSection, FieldRow, FormCancel } from '@/components/company-os';

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
</Form>
```

## Props

### FormLayout

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The page title: "Create project", "Edit project". |
| `actions` | `ReactNode` | — | Cancel then the primary, right-aligned, sticky. |
| `side` | `ReactNode` | — | Small cards for fixed fields. |
| `children` | `ReactNode` | — | The section cards. |

### FormSection

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | One title, no description. |
| `compact` | `boolean` | `false` | One column; the shape of a side card. |

## Accessibility

- One `<h1>` in the header, one `<h2>` per section.
- The primary button is a submit button inside the page's form; Enter submits.

## Don't

- No actions at the bottom of the page.
- No description text under a section title.
- No Escape-to-cancel on a full page.
- No status field in an edit form; status changes go through their own verb and dialog.

## FAQ

**Fewer than six fields?**

FormDialog.
