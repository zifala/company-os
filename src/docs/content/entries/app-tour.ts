import type { DocEntry } from '../types';

export const appTour: DocEntry = {
    slug: 'app-tour',
    name: 'AppTour',
    category: 'shell',
    pieces: [9],
    tagline: 'One short overlay tour over the shell, once per user. Hidden targets are skipped by size.',
    job: 'Walk a new user through navigation, New and search in under a minute.',
    tags: ['tour', 'onboarding', 'driver', 'overlay', 'walkthrough'],
    exports: ['AppTour', 'visibleSteps', 'tourLabels', 'TourStep', 'TourLabels'],
    files: ['components/company-os/app-tour.tsx'],
    intro: [
        'Mounted once in the app layout. When <code>run</code> is true it waits 1.2 s for deferred props to render, collects the steps whose <code>[data-tour]</code> element has a box, and drives them with driver.js: slate overlay, progress, no interaction with the highlighted element. Closing early counts as finished; <code>onFinish</code> fires either way.',
        'The page decides when to run: shared <code>showTour</code> from the user row or <code>?tour=1</code> for a replay. A ref keyed by the current URL stops a second run on partial reloads. Shell elements already carry <code>data-tour</code>: <code>sidebar</code>, <code>quick-create</code>, <code>search</code>, <code>bell</code>, plus each nav item\'s <code>tour</code> key.',
    ],
    examples: [
        {
            title: 'Two steps',
            description: 'The demo runs over the search button and the stat row after 100 ms.',
            demoKey: 'app-tour',
            code: `import { AppTour } from '@/components/company-os';
import { router, usePage } from '@inertiajs/react';
import { finish } from '@/routes/tour';

const { url, props } = usePage();
const isReplay = new URLSearchParams(url.split('?')[1]).get('tour') === '1';

<AppTour
  run={url.startsWith('/dashboard') && (props.showTour || isReplay)}
  steps={[
    { target: 'sidebar', title: t('tour.sidebar.title'), description: t('tour.sidebar.body') },
    { target: 'quick-create', title: t('tour.new.title'), description: t('tour.new.body') },
    { target: 'search', title: t('tour.search.title'), description: t('tour.search.body') },
  ]}
  labels={{ next: t('tour.next'), back: t('tour.back'), done: t('tour.done') }}
  onFinish={() => {
    if (!isReplay) {
      router.post(finish.url(), {}, { preserveState: true, preserveScroll: true });
    }
  }}
/>`,
        },
    ],
    props: [
        {
            component: 'AppTour',
            rows: [
                { name: 'steps', type: 'TourStep[]', description: '<code>{ target, title, description }</code>. <code>target</code> matches <code>data-tour="…"</code>. Four to six steps.' },
                { name: 'run', type: 'boolean', description: 'Start when true and not yet started on this URL.' },
                { name: 'onFinish', type: '() => void', description: 'After Done, Esc or an overlay click. Post <code>tour.finish</code> unless replaying.' },
                { name: 'labels', type: 'Partial<TourLabels>', description: 'next, back, done.' },
                { name: 'delayMs', type: 'number', defaultValue: '1200', description: 'Wait before collecting targets, so deferred sections exist.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: '→ / Enter', action: 'Next step.' },
            { keys: '←', action: 'Previous step.' },
            { keys: 'Esc', action: 'End the tour.' },
        ],
        notes: [
            'Animation follows <code>prefers-reduced-motion</code>.',
            'The popover is a driver.js dialog with the step title as its heading; the highlighted element is not interactive during the step.',
            'Steps whose element is hidden (collapsed sidebar, missing permission) are dropped, never shown pointing at nothing.',
        ],
    },
    donts: [
        'No seen flag in localStorage. The user row stores <code>tour_seen_at</code>, once across devices.',
        'No permission list in the tour. Visibility by element size only.',
        'No tour on the setup page. Super admins see it after setup is finished.',
        'No colours in the step config. The overlay uses <code>--color-slate-900</code>.',
    ],
    faq: [
        { q: 'Replay?', a: 'Link "Take the tour" in the user menu to <code>dashboard?tour=1</code>. Same component, same steps; the page skips the post.' },
        { q: 'Why no steps appeared?', a: 'Every target had no box after the delay. Check the <code>data-tour</code> keys and that the elements render on that page.' },
    ],
};
