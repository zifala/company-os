# company-os/laravel

The server half of the Company OS recipes, as a composer package. The recipes in `src/docs/content/recipes/` stay the source of truth; this package ports the app-agnostic PHP they show so each app stops copying it by hand.

- PHP ^8.3, Laravel 12 or 13 (`laravel/framework`: `FormRequest` and queued jobs live in the framework, not in the split `illuminate/*` packages).
- No dependency on an app's `User` model or any app model. Apps register their models, gates and routes through closures in a service provider's `boot()`.
- `spatie/laravel-activitylog` is suggested, not required.

## Install

Not on Packagist yet (see [Releasing](#releasing)). The package lives in this repo under `packages/laravel`, and the repo root has no `composer.json`, so a plain `vcs` repository pointing at `company-os.git` does not find it. Until it is published, check this repo out next to the app and use a `path` repository:

```json
"repositories": [{ "type": "path", "url": "../company-os/packages/laravel", "options": { "symlink": false } }]
```

```bash
composer require company-os/laravel:@dev
php artisan vendor:publish --tag=company-os-config   # optional
php artisan vendor:publish --tag=company-os-lang     # optional, to edit en / so wording
```

Once it is published: `composer require company-os/laravel:^0.1` and drop the `repositories` entry.

The service provider `CompanyOs\CompanyOsServiceProvider` is auto-discovered.

## What is in it

| Class | Recipe | What it does |
| --- | --- | --- |
| `Http\Requests\ReasonRequest` | `audit`, `trash`, `status-dialog` | `reason` required, string, min 3, max 1000 (`MinLength`, `MaxLength`). `reason()` accessor, `reasonRules()` for requests that cannot extend it. `authorize()` is `true`: the guard stays in the Action. |
| `Audit\AuditChanges` | `audit` | `of($model, $except)` → `{changed, old, new}` of dirty fields. Strings over `LongText = 200` logged as `{length}`. Leaves out `created_at`, `updated_at` and the model's `$hidden`. |
| `Audit\AuditEvents` | `audit` | `label($event)` from the app's `audit.events.*`, raw name as fallback. `prefix()`, `prefixes()` for the event filter, `wherePrefix($query, $prefix)` (escaped, every driver), `likePrefix()` for `whereLike` on Postgres / MySQL. |
| `Support\Csv` | `audit` (export), `views-import-export` | `cell()` prefixes `'` when a value starts with `= + - @ tab CR`; dates as `Y-m-d H:i:s`, enums by value (backed) or name (pure). `write($file, $headers, $rows)` adds the BOM and defuses every cell; `row()` writes one. |
| `Contracts\AuditLogger`, `Audit\SpatieAuditLogger`, `Audit\NullAuditLogger` | `audit` | The one seam package code uses to write an audit row (only `PurgeTrash` uses it). Spatie when `activity()` exists, else no-op, or your class via `company-os.audit_logger`. The spatie logger only attaches a subject when its key is a string, per the uuid `subject_id` gotcha. |
| `Trash\TrashBin`, `Trash\TrashType` | `trash` | `Days = 30`, `cutoff()`, `ensureRestorable($model, ?$parent)`, `daysLeft()`, `newBatch()`, `types($user)`, `for($user, ?$type)` (merged, newest first, paginated in memory, who + reason from the latest `*.deleted` activity on the current page). |
| `Jobs\PurgeTrash` | `trash` | Daily, idempotent. Per chunk: `beforePurge` → null self-referencing parent column → force delete. Types `withFiles()` force delete model by model, outside the transaction. One `trash.purged` row per run with counts per type; none when nothing was purged. |
| `Setup\SetupSteps` | `setup-checklist` | `register($key, $done, $links)`, `all()` → `list<{key, title, done, links}>`. `done` is `true` / `false` from a closure or `null` for review-only. `route()` builds relative hrefs lazily. `services()` step, `complete()` (ignores `null`), `status()` badge word. |
| `Search\GlobalSearch` | `command-palette` | `group($key, query, columns, map, code)`, `groups($user, $term)` → `list<{key, name, items: list<{id, label, url}>}>`. `MinLength = 2`, `PerGroup = 5`. Query closure returns `null` when the user may not see the group. Exact `code` match ranks first, then newest `updated_at`. |
| `Search\TextSearch` | `command-palette` | `contains($query, $columns, $term)`: `ilike` on pgsql, `like` elsewhere, `% _ \` escaped. An empty column list matches nothing. |
| `Support\ServiceStatus` | `settings` | `rows()` → `list<{key, label, ok, env}>`, built-in `mail` + `queue`, `register()` for more, `allOk()`. Reads `config()`, never `env()`. Never returns config values. |
| `Support\UserTime` | `settings` | `today()`, `toUtc()`, `local()`, `quietHoursEnd()` (window is `[start, end)`, handles windows across midnight, equal start and end = none), `profileRules()`. Takes any user object, or a timezone string. |
| `Support\Label` | `bilingual` | Lang lookup with an app key first, the package key second, the raw key last. Used by everything above. |

### Where this differs from the recipe code, and why

- **Registration instead of hardcoded models.** `GlobalSearch`, `TrashBin`, `SetupSteps` and `ServiceStatus` hold static registries that the app fills in `boot()`. Each has `flush()` for tests.
- **`TextSearch` wraps columns with the connection's grammar.** The recipe hand-writes `"column"`, which MySQL reads as a string unless `ANSI_QUOTES` is on. MySQL and MariaDB also get no `escape '\'` clause, because `\` is already their LIKE escape and `'\'` is not a valid literal there. sqlsrv also escapes `[`.
- **`AuditChanges` also skips `$hidden` attributes**, so passwords and tokens never reach the log even when nobody lists them in `$except`.
- **`TrashType` is deny-by-default.** A type registered without `visibleWhen()` is hidden from everyone.
- **`ensureRestorable()` takes an optional parent** so "restore refuses a child whose parent is still trashed" lives in the same guard.
- **`TrashBin::days()` reads `company-os.trash.days`** (default 30, the `Days` constant). Keep it at 30 unless you change the UI copy as well.
- **`GlobalSearch::groups()` items also carry `key`.** The recipe shape `{name, items}` is unchanged otherwise.
- **`ServiceStatus` treats a `null` or empty driver as missing**, so "every service reads missing on an empty config" holds.
- **Trash reads the model's own soft-delete column** (`getDeletedAtColumn()`), so a model with a custom `DELETED_AT` works in the list, the restore guard and the purge.
- **`AuditEvents::wherePrefix()` adds `escape '\'`.** SQLite and sqlsrv have no default LIKE escape, so `whereLike(..., likePrefix())` only escapes on Postgres and MySQL.

## Usage

### Reason on serious endpoints

```php
use CompanyOs\Http\Requests\ReasonRequest;

public function destroy(ReasonRequest $request, Client $client, DeleteClient $action): RedirectResponse
{
    $action->handle($client, $request->user(), $request->validated());

    return to_route('clients.index')->with('toast', __('trash.moved', ['name' => $client->name]));
}
```

### Audit changes and CSV export

```php
use CompanyOs\Audit\AuditChanges;
use CompanyOs\Audit\AuditEvents;
use CompanyOs\Support\Csv;

$client->fill($data);
$changes = AuditChanges::of($client, except: ['api_token']);
$client->save();
activity()->performedOn($client)->causedBy($actor)->event('client.updated')->withProperties($changes)->log('client.updated');

// AuditLog::write() in the app
Csv::write($file, [__('audit.headers.when'), __('audit.headers.who'), __('audit.headers.event')],
    $query->limit(self::MaxExportRows)->lazy()->map(fn (Activity $row) => [
        $row->created_at->utc()->toDateTimeString(), $row->causer?->name, AuditEvents::label($row->event),
    ]));

// event filter
->when($filters['event'] ?? null, fn ($q, $event) => AuditEvents::wherePrefix($q, $event))
```

### Trash

```php
use CompanyOs\Trash\TrashBin;
use CompanyOs\Trash\TrashType;

// AppServiceProvider::boot()
TrashBin::register(TrashType::make('clients', Client::class)
    ->visibleWhen(fn (User $user) => $user->can('clients.delete'))
    ->scope(fn ($query, User $user) => $query->visibleTo($user))
    ->recordVisibleWhen(fn (Client $client, User $user) => $user->can('delete', $client))
    ->row(fn (Client $client) => ['label' => $client->name, 'context' => $client->city])
    ->parent('parent_id')
    ->beforePurge(fn ($ids) => TimeEntry::whereIn('client_id', $ids)->update(['client_id' => null])));

// TrashController::index
return Inertia::render('trash/index', [
    'types' => TrashBin::types($request->user()),
    'rows' => TrashBin::for($request->user(), $request->query('type'))->withQueryString(),
]);

// RestoreClient Action
Gate::forUser($actor)->authorize('delete', $client);
TrashBin::ensureRestorable($client, $client->parent()->withTrashed()->first());
$client->restore();

// routes/console.php
Schedule::job(new \CompanyOs\Jobs\PurgeTrash)->dailyAt('01:00')->withoutOverlapping()->onOneServer();
```

The who + reason lookup reads `company-os.trash.activity_model`, falling back to `activitylog.activity_model`. It expects spatie's columns (`subject_type`, `subject_id`, `event`, `properties`, a `causer` relation) and shows `causer.name`.

### Setup checklist

```php
use CompanyOs\Setup\SetupSteps;

SetupSteps::register('team', fn () => User::query()->active()->count() > 1 || Invitation::query()->live()->exists(), [
    SetupSteps::route('users', 'organization.users.index'),
]);
SetupSteps::register('security', fn () => WorkspaceSetting::current()->require_two_factor, [
    SetupSteps::route('workspace', 'organization.workspace.general'),
]);
SetupSteps::register('billing', null, [SetupSteps::route('billing', 'organization.billing.index')]); // review-only
SetupSteps::services();

// SetupController::show
return Inertia::render('app/organization/setup', ['steps' => SetupSteps::all(), 'services' => ServiceStatus::rows()]);
```

### Global search

```php
use CompanyOs\Search\GlobalSearch;

GlobalSearch::group('invoices',
    query: fn (User $user) => $user->can('invoices.view-any') ? Invoice::query()->visibleTo($user) : null,
    columns: ['customer_name'],
    map: fn (Invoice $row) => ['id' => $row->id, 'label' => $row->number.' · '.$row->customer_name, 'url' => route('invoices.show', $row)],
    code: 'number',
);

// SearchController (invokable), route GET search ->middleware(['auth', 'throttle:60,1'])
return response()->json(['groups' => GlobalSearch::groups($request->user(), (string) $request->query('q'))]);
```

### Services and user time

```php
use CompanyOs\Support\ServiceStatus;
use CompanyOs\Support\UserTime;

ServiceStatus::register('sms', fn () => filled(config('services.sms.key')), ['SMS_KEY']);

$overdue = $task->due_on->lt(UserTime::today($user));
$from = UserTime::toUtc($filters['from'], $viewer);
$delayUntil = UserTime::quietHoursEnd($recipient);

// ProfileUpdateRequest::rules()
return [...UserTime::profileRules(), 'name' => ['required', 'string', 'max:255']];
```

## Lang

Two kinds of strings:

1. **Generic package strings** in the `company-os::` namespace: `reason.attribute`, `trash.not_in_trash`, `trash.too_old`, `trash.parent_in_trash`, `trash.empty`, `services.mail`, `services.queue`, `setup.status.{done,todo,review}`. The same key in the app's own file wins (for example `trash.not_in_trash` in `lang/en/trash.php`), then `lang/vendor/company-os`, then the package.
2. **App-specific labels** the app must define, under prefixes set in `company-os.lang`:
   - `audit.events.<event>` (fallback: raw event name)
   - `search.groups.<key>` (fallback: key)
   - `setup.steps.<key>`, `setup.links.<label>` (fallback: key)
   - `trash.types.<key>` (fallback: `types.<key>`)
   - `services.<key>` for services you register

> **Somali needs review.** Every file in `lang/so/` is a placeholder written without a native speaker and is marked `NEEDS REVIEW` at the top. Have the app owner check them before shipping, or override them in `lang/vendor/company-os/so/`.

## What stays in the app

These are app-shaped, so the package leaves them out on purpose:

- The `Activity` model, its migration (uuid morphs, precision 6) and `config/activitylog.php`.
- `AuditLog` (query with the app's `User` causer type, page, `MaxExportRows`), `AuditLogController`, `AuditLogRequest`, routes, the `audit.view` gate, `audit.headers.*` lang.
- Every `Delete<Model>` / `Restore<Model>` Action, the `TrashController`, its `->withTrashed()` routes, unique rules scoped `whereNull('deleted_at')`, `deletion_batch` columns and the restore-by-batch query.
- `WorkspaceSetting`, its `current()` singleton, `Set<Setting>` Actions, `FinishSetup`, `SendTestEmail`, the home redirect for the super admin, `isSuperAdmin()`.
- The `users` columns (`timezone`, `quiet_hours_start`, `quiet_hours_end`) and the profile page.
- The search route, its throttle, `pg_trgm` indexes, and everything on the React side (palette, g-keys, quick create, `can_create`).
- Every gate and permission name. The package only calls the closures you give it.

## Tests

```bash
cd packages/laravel
composer install
vendor/bin/pest
```

The suite runs on Orchestra Testbench with in-memory SQLite and fixture models. It covers each recipe's "Test:" section where that works without a full app. Endpoint 403s, Inertia props and the home redirect belong to the app's tests.

CI: `.github/workflows/laravel-package.yml` at the repo root runs the suite on PHP 8.3 and 8.4 against Laravel 12 (Testbench 10) and Laravel 13 (Testbench 11), on every push to `main` and every pull request that touches `packages/laravel/**`. `composer.lock` is not committed, so each run resolves the newest versions in range.

## Releasing

Not released yet. The roadmap gate: tag and publish only once a product has run the package in production. When that holds:

1. **Pick the distribution path (once).** Packagist reads `composer.json` from the root of a git repository, and this one lives in a subdirectory, so either:
   - **Split repo (recommended).** Create `<org>/company-os-laravel`, mirror `packages/laravel` into it on every push to `main` and every `laravel-v*` tag (a `git subtree split --prefix=packages/laravel` job, or an action such as `symplify/monorepo-split-github-action`), and submit that repo to Packagist. Tags in the split repo are plain `v0.1.0`.
   - **Private only.** Skip Packagist and let apps use a `path` repository as in [Install](#install), or a private registry (Private Packagist, Satis) fed from the split repo.
2. **Settle the license.** `composer.json` says `proprietary` and the repo has no `LICENSE` file. Public Packagist will list a proprietary package, but anyone can install it. Decide on a license (and add `LICENSE`) or keep the package private (path / private registry) before step 5.
3. **Check it is green.** The `laravel package` workflow passes on `main`; locally `composer validate --strict` and `vendor/bin/pest`.
4. **Cut the changelog.** In `CHANGELOG.md`, change `## [0.1.0] - Unreleased` to today's date, keep an empty `## [Unreleased]` above it, and fix the compare links if the split repo is used.
5. **Tag.** In this repo: `git tag -a laravel-v0.1.0 -m "company-os/laravel 0.1.0"` on the release commit and push the tag; the split job carries it over as `v0.1.0`. Do not add a `version` field to `composer.json`: Packagist reads versions from tags.
6. **Publish.** Submit the split repo on packagist.org once and enable its GitHub hook so later tags appear on their own. Then switch the Install section to `composer require company-os/laravel:^0.1`.
7. **Check the dist.** `composer require company-os/laravel` in a fresh Laravel app, and confirm the archive leaves out `tests/`, `phpunit.xml` and the dotfiles (`.gitattributes` `export-ignore`).

Versioning: `0.x` until the API has held across two products. A minor bump (`0.1` to `0.2`) may break the API and says so in the changelog; a patch never does.
