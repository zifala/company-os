# Changelog

All notable changes to `company-os/laravel` are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the package follows [Semantic Versioning](https://semver.org/). While the version is `0.x`, a minor release (`0.1` to `0.2`) may break the public API; a patch release never does.

## [Unreleased]

## [0.1.0] - Unreleased

First release: the app-agnostic PHP from the Company OS recipes, as a package. Requires PHP ^8.3 and Laravel 12 or 13.

### Added

- `CompanyOsServiceProvider`, auto-discovered. Merges `config/company-os.php`, loads the `company-os::` lang namespace, publishes the tags `company-os-config` and `company-os-lang`, and binds `Contracts\AuditLogger`.
- `Http\Requests\ReasonRequest` (recipes `audit`, `trash`, `status-dialog`): `reason` required, string, 3 to 1000 characters; `reason()` returns it trimmed; `reasonRules()` for requests that cannot extend it.
- `Audit\AuditChanges::of()`: `{changed, old, new}` of the dirty fields, long text logged as `{length}`, timestamps and `$hidden` left out.
- `Audit\AuditEvents`: `label()`, `prefix()`, `prefixes()`, `likePrefix()` and `wherePrefix()` (an escaped prefix filter that works on every driver).
- `Contracts\AuditLogger` with `Audit\SpatieAuditLogger` (subject attached only for string keys) and `Audit\NullAuditLogger`; override with `company-os.audit_logger`.
- `Support\Csv`: `cell()` defuses formula prefixes, `write()` adds the BOM, `row()` writes one defused row.
- `Trash\TrashBin` and `Trash\TrashType` (recipe `trash`): registry, deny-by-default types, `cutoff()`, `ensureRestorable()` with an optional parent, `daysLeft()`, `newBatch()`, `types()`, `for()` with who + reason from the latest `*.deleted` activity. Honours a model's custom `DELETED_AT` column.
- `Jobs\PurgeTrash`: daily, idempotent force delete past the window, `beforePurge` hook, self-referencing parent column nulled, `withFiles()` types deleted model by model, one `trash.purged` audit row per run.
- `Setup\SetupSteps` (recipe `setup-checklist`): lazy `register()`, `route()` relative hrefs, `services()`, `all()`, `step()`, `complete()`, `status()`.
- `Search\GlobalSearch` and `Search\TextSearch` (recipe `command-palette`): registered groups, `MinLength = 2`, `PerGroup = 5`, exact code match first, `ilike` on pgsql, wildcards escaped per driver, columns wrapped by the grammar.
- `Support\ServiceStatus` (recipe `settings`): built-in `mail` and `queue` rows, `register()`, `withoutDefaults()`, `allOk()`; env names only, never values.
- `Support\UserTime` (recipe `settings`): `timezone()`, `today()`, `toUtc()`, `local()`, `quietHoursEnd()`, `profileRules()`, attribute names from config.
- `Support\Label`: app key first, package key second, raw key last.
- Lang in `en` and `so` (Somali marked `NEEDS REVIEW`) for `reason`, `services`, `setup`, `trash`.
- Pest suite on Orchestra Testbench with in-memory SQLite, and a GitHub Actions matrix (PHP 8.3 / 8.4 × Laravel 12 / 13).

### Fixed before release

- `TrashBin` and `PurgeTrash` read the model's soft-delete column instead of a hardcoded `deleted_at`.
- `TextSearch::contains()` with an empty column list matches nothing instead of every row.
- `UserTime::quietHoursEnd()` treats the window as `[start, end)` in both shapes, and equal start and end as no quiet hours rather than 24 hours.
- `Label::appOrPackage()` falls back to the raw key, so an app-registered service without a label reads `sms`, not `company-os::services.sms`.
- `AuditEvents::prefixes()` sorts numeric prefixes as strings.
- `Csv::cell()` writes a pure enum as its case name instead of throwing.

[Unreleased]: https://github.com/zifala/company-os/compare/laravel-v0.1.0...HEAD
[0.1.0]: https://github.com/zifala/company-os/releases/tag/laravel-v0.1.0
