# Tour

Rule: every user gets one short overlay tour on home, once across devices; steps whose element is hidden are skipped; `?tour=1` replays without writing.

Shape:
- `users.tour_seen_at` (nullable timestamp, cast `datetime`).
- `app/Actions/User/FinishTour.php` — stamps once, audits `user.tour_finished`.
- `app/Http/Controllers/TourController.php` — invokable, `POST tour/finish` (`tour.finish`) → `back()`.
- `HandleInertiaRequests::share()` → `showTour` (lazy closure).
- `resources/js/components/app-tour.tsx` — `AppTour`, mounted once in the app layout. Uses `driver.js`.
- Targets: `data-tour="<key>"` on shell elements (sidebar, search button, "New" menu, one or two key nav items via a `tour` field on the nav item).
- Replay link in the user menu: `dashboard({}, { query: { tour: 1 } })`, label "Take the tour".
- Step copy in `lang/en/tour.php`, `lang/so/tour.php`: `tour.<key>.title`, `tour.<key>.body`.

Code:

```php
final class FinishTour
{
    public function handle(User $user): User
    {
        if ($user->tour_seen_at !== null) {
            return $user;
        }

        $user->update(['tour_seen_at' => now()]);

        activity()->performedOn($user)->causedBy($user)->event('user.tour_finished')->log('user.tour_finished');

        return $user;
    }
}
```

```php
'showTour' => fn (): bool => $user !== null && $user->tour_seen_at === null
    && (! $user->isSuperAdmin() || WorkspaceSetting::current()->setup_finished_at !== null),
```

```tsx
const targets = ['sidebar', 'quick-create', 'search', '<module>'];

const isShown = (element: Element | null): element is Element => {
    const rect = element?.getBoundingClientRect();

    return rect !== undefined && rect.width > 0 && rect.height > 0;
};

const visibleSteps = (t: Translate): DriveStep[] =>
    targets.flatMap((target) => {
        const element = document.querySelector(`[data-tour="${target}"]`);

        return isShown(element)
            ? [{ element, popover: { title: t(`tour.${target}.title`), description: t(`tour.${target}.body`) } }]
            : [];
    });

export function AppTour() {
    const { url, props } = usePage();
    const t = useTrans();
    const startedOnUrl = useRef<string | null>(null);
    const isReplay = new URLSearchParams(url.split('?')[1]).get('tour') === '1';
    const shouldRun = url.startsWith('/dashboard') && (props.showTour || isReplay);

    useEffect(() => {
        if (!shouldRun || startedOnUrl.current === url) {
            return;
        }

        const start = window.setTimeout(() => {
            const steps = visibleSteps(t);

            if (steps.length === 0) {
                return;
            }

            startedOnUrl.current = url;
            driver({
                steps,
                showProgress: true,
                disableActiveInteraction: true,
                animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                onDestroyed: () => {
                    if (!isReplay) {
                        router.post(finish.url(), {}, { preserveState: true, preserveScroll: true });
                    }
                },
            }).drive();
        }, 1200);

        return () => window.clearTimeout(start);
    }, [url, shouldRun, isReplay]);

    return null;
}
```

- 4–6 steps. Shell first (navigation, New, search), then the one or two pages the product lives in.
- `t()` and its `Translate` type come from the bilingual piece.
- Button texts (`nextBtnText`, `prevBtnText`, `doneBtnText`) from lang too.
- Each step mentions its keyboard shortcut (`N`, `⌘K`) so the tour teaches the palette.

Test:
- New user: home shares `showTour` true; after `POST tour.finish` it is false; redirect is back.
- Super admin: `showTour` false until `setup_finished_at` is set, then true.
- Finishing twice keeps the first `tour_seen_at` and logs once (`travelTo`).
- `GET dashboard?tour=1` for a user who has seen it writes nothing and logs nothing.
- Guest `POST tour.finish` → redirect to login.
- Every `tour.*` key exists in both `lang/en` and `lang/so` (one dataset over the targets).

Gotchas:
- Seen state on the user row, not localStorage — once across devices and browsers.
- Closing early (Esc, overlay click) counts as seen: `onDestroyed` fires either way. Correct; nobody wants it back.
- Replay never posts. Otherwise replay is the same code path.
- Hidden targets are skipped by size, not by permission logic: a gated nav item the user lacks, or a collapsed mobile sidebar, has no box. No permission list in the tour.
- The start delay lets deferred props render; without it targets inside deferred sections are missing.
- `startedOnUrl` ref stops a second run on Inertia partial reloads of the same URL.
- Super admin is sent to setup first; a tour over the setup page is noise.
- Overlay colours come from the app's tokens, never hardcoded.

Harvested: 2026-10-08 (all from source; replay, guest and lang-key tests from standard)
