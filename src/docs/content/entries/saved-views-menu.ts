import type { DocEntry } from '../types';

export const savedViewsMenu: DocEntry = {
    slug: 'saved-views-menu',
    name: 'SavedViewsMenu',
    category: 'views',
    pieces: [15],
    tagline: 'Saved filter sets for a list. The menu knows which one is active by comparing the URL.',
    job: 'Save the current query of a list under a name and return to it in one click.',
    tags: ['saved views', 'filters', 'query', 'share', 'list'],
    exports: ['SavedViewsMenu', 'SaveViewDialog', 'activeView', 'viewDefinition', 'SavedViewItem'],
    files: ['components/company-os/saved-views-menu.tsx', 'components/company-os/save-view-dialog.tsx', 'components/company-os/saved-view-query.ts'],
    registryDeps: ['filter-bar', 'field-row'],
    shadcnDeps: ['dropdown-menu', 'dialog', 'checkbox', 'input', 'label', 'button'],
    intro: [
        'A list\'s URL query is its state, so a saved view is that query under a name. The menu lists personal and shared views, highlights the one whose query equals the current one (ignoring <code>page</code> and any <code>implied</code> keys), and offers "Save current view", plus Update and Delete when the policy allows.',
        'Picking a view navigates to the list with its query. Saving opens the <b>SaveViewDialog</b>; the page posts <code>viewDefinition(state)</code> with the name and scope. Delete goes through a ConfirmDialog the page renders.',
    ],
    examples: [
        {
            title: 'In the FilterBar end slot',
            demoKey: 'saved-views-menu-basic',
            code: `import { FilterBar, SavedViewsMenu, viewDefinition } from '@/components/company-os';

<FilterBar
  state={state}
  end={
    <SavedViewsMenu
      state={state}
      views={savedViews.views}
      canShare={savedViews.can_share}
      saving={form.processing}
      saveError={form.errors.name}
      onSave={({ name, shared }) => form.transform(() => ({ name, scope: shared ? 'shared' : 'personal', ...viewDefinition(state) })).post(savedViewsRoutes.store().url)}
      onUpdate={(view) => router.patch(savedViewsRoutes.update(view.id).url, viewDefinition(state))}
      onDelete={setDeleting}
    />
  }
/>`,
        },
    ],
    props: [
        {
            component: 'SavedViewsMenu',
            rows: [
                { name: 'state', type: 'FilterState', description: 'The list\'s current query.' },
                { name: 'views', type: 'SavedViewItem[]', description: '<code>{ id, name, query, is_shared, owner, can_update, can_delete }</code> from the server.' },
                { name: 'canShare', type: 'boolean', description: 'Shows the share checkbox in the dialog.' },
                { name: 'implied', type: 'string[]', description: 'Query keys to ignore when matching, like a container id.' },
                { name: 'saving · saveError · onSave', type: 'boolean · string · ({ name, shared }) => void', description: 'The save request.' },
                { name: 'onUpdate · onDelete', type: '(view) => void', description: 'Update the active view\'s query; open the delete confirm.' },
            ],
        },
    ],
    a11y: {
        notes: ['A Radix menu; the shared icon carries "Shared by {owner}" as its label.', 'The dialog returns focus to the trigger on close.'],
    },
    donts: ['No saved view stored in local storage. It is a row with a policy.', 'No unknown filter keys saved; the server cleans the definition.', 'No delete without the ConfirmDialog.'],
    faq: [{ q: 'Favorite a view?', a: 'The active view can be pinned with FavoriteButton next to the menu; it then appears in the sidebar favorites.' }],
};
