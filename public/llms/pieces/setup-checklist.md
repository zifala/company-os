# Setup checklist

Rule: one checklist page for the super admin; each step ticks from real data, never from a click; home redirects the super admin there until "Finish setup".

Shape:
- `workspace_settings.setup_finished_at` (nullable timestamp) on the settings singleton.
- `app/Support/SetupSteps.php` — `all(): list<{key, title, done, links}>`. `done`: `true` / `false` from a query, `null` = review-only step (never ticks).
- `app/Actions/Workspace/FinishSetup.php` — super admin only, stamps once, audits `workspace.setup_finished`.
- `app/Http/Controllers/Organization/SetupController.php` — `show`, `finish`, `testEmail`. Thin.
- Routes in `routes/organization.php`: `GET organization/setup` (`organization.setup.show`), `POST setup/finish`, `POST setup/test-email` (`throttle:3,1`).
- Page `pages/<app>/organization/setup.tsx` + `setup/StepRow.tsx`, `setup/types.ts`. Step-specific panels sit beside it.
- Redirect lives in the home controller, not a global middleware.
- Rerun link: Organization → Workspace → "Open setup".
- `lang/en/setup.php`, `lang/so/setup.php` — step titles, link labels, status words.

Code:

```php
final class SetupSteps
{
    /** @return list<array{key: string, title: string, done: bool|null, links: list<array{label: string, href: string}>}> */
    public static function all(): array
    {
        return [
            self::step('team', User::query()->active()->count() > 1 || self::hasLiveInvitation(), [
                ['users', route('organization.users.index', [], false)],
            ]),
            self::step('security', WorkspaceSetting::current()->require_two_factor, [
                ['workspace', route('organization.workspace.general', [], false)],
            ]),
            self::step('<module>', null, [
                ['<module>', route('organization.<module>.index', [], false)],
            ]),
            self::step('services', collect(ServiceStatus::rows())->every('ok'), []),
        ];
    }

    /** @param list<array{0: string, 1: string}> $links */
    private static function step(string $key, ?bool $done, array $links): array
    {
        return [
            'key' => $key,
            'title' => __("setup.steps.{$key}"),
            'done' => $done,
            'links' => array_map(fn (array $link): array => ['label' => __("setup.links.{$link[0]}"), 'href' => $link[1]], $links),
        ];
    }
}
```

```php
final class FinishSetup
{
    public function handle(User $actor): WorkspaceSetting
    {
        if (! $actor->isSuperAdmin()) {
            throw new AuthorizationException;
        }

        $setting = WorkspaceSetting::current();

        if ($setting->setup_finished_at !== null) {
            return $setting;
        }

        $setting->setup_finished_at = now();
        $setting->save();

        activity()->causedBy($actor)->event('workspace.setup_finished')->log('workspace.setup_finished');

        return $setting;
    }
}
```

```php
public function __invoke(Request $request): Response|RedirectResponse
{
    if ($request->user()->isSuperAdmin() && WorkspaceSetting::current()->setup_finished_at === null) {
        return to_route('organization.setup.show');
    }

    return Inertia::render('<app>/home');
}
```

- `SetupController::show`: `abort_unless($request->user()->isSuperAdmin(), 403)`, render `steps`, `services`, plus whatever inline panels need.
- `finish` → `FinishSetup` → `to_route('dashboard')`.
- `testEmail` → `SendTestEmail` Action: sends now (not queued) to the actor, mail error shown as is.
- Step row: title, status badge (Done / To do / Review), one outline button per link. Footer: "Finish setup" button. Nothing blocks finishing.

Typical steps (pick per app): your organisation record, team (another active user or a live invitation), security (2FA required), services (every `ServiceStatus` row ok), plus review-only steps that link to each config page the app has.

Test:
- Dashboard redirects super admin to setup; normal user gets home; after finish, super admin gets home.
- Setup show, finish, test-email return 403 for a user with `settings.manage` but not super admin; no settings row written.
- `done` flags flip from `false` to `true` as factories create the data; review steps stay `null`.
- Finishing twice keeps the first timestamp and logs `workspace.setup_finished` once (`Carbon::setTestNow`).
- Test-email route is throttled.
- `tests/Pest.php` helper `setupFinished()` so every other super-admin test skips the redirect.

Gotchas:
- Redirect only the home route. A global middleware traps the admin away from the very pages the steps link to.
- Never store "step done" flags. A stale tick lies; a query does not.
- Review-only steps (`null`) must not count against "complete". Finish is always allowed.
- Hrefs relative (`route(..., [], false)`) so they work behind any host.
- Starter templates or sample data offered in setup are product content. Plant them as normal editable rows through an Action, skip names that exist. Never part of this piece.
- Services show ok / missing plus env names to set, never values. Reads `config()`, not `env()`.
- Tour waits for setup: share `showTour` false for the super admin until `setup_finished_at` is set (see `tour`).

Harvested: 2026-10-08
