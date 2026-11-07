import type { DocEntry } from '../types';

export const favoriteButton: DocEntry = {
    slug: 'favorite-button',
    name: 'FavoriteButton',
    category: 'views',
    pieces: [15],
    tagline: 'A star that pins any viewable record or saved view to the sidebar.',
    job: 'Toggle one record in the user\'s favorites.',
    tags: ['favorite', 'pin', 'star', 'sidebar'],
    exports: ['FavoriteButton'],
    files: ['components/company-os/favorite-button.tsx'],
    shadcnDeps: ['button'],
    intro: [
        'An icon button with <code>aria-pressed</code>. The page knows whether the record is saved (from the shared <code>favorites</code> prop) and posts or deletes on toggle; the sidebar re-renders its Favorites group from the same prop.',
    ],
    examples: [
        {
            title: 'On a record header',
            demoKey: 'favorite-button-basic',
            code: `import { FavoriteButton } from '@/components/company-os';

const saved = favorites.find((f) => f.kind === 'project' && f.target_id === project.id);

<FavoriteButton
  saved={saved !== undefined}
  label={project.name}
  onToggle={() => saved
    ? router.delete(favoritesRoutes.destroy(saved.id).url, { only: ['favorites'] })
    : router.post(favoritesRoutes.store().url, { kind: 'project', id: project.id }, { only: ['favorites'] })}
/>`,
        },
    ],
    props: [
        {
            component: 'FavoriteButton',
            rows: [
                { name: 'saved', type: 'boolean', description: 'Current state from the shared prop.' },
                { name: 'label', type: 'string', description: 'The record name, used in the accessible label.' },
                { name: 'onToggle', type: '() => void', description: 'The page\'s request.' },
                { name: 'addLabel · removeLabel', type: '(name) => string', description: 'Translated label builders.' },
            ],
        },
    ],
    a11y: { notes: ['<code>aria-pressed</code> states the toggle; the label names the record and the action.'] },
    donts: ['No favorite stored in React state alone; the server is the source.', 'No star inside table rows.'],
    faq: [{ q: 'What can be favorited?', a: 'Anything the user can view: records and saved views. The server re-checks on every render, so lost access drops the pin.' }],
};
