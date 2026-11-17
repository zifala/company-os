# Audit

Rule: every state change logs `<noun>.<verb_past>` in its Action; serious ones carry a reason; one audit page filters and exports it all.

Shape:
- `spatie/laravel-activitylog`. Own model `app/Models/Activity.php` extends the package model, `HasUuids`; set as `activity_model` in `config/activitylog.php`.
- Migration: `uuid('id')`, `nullableUuidMorphs('subject')`, `nullableUuidMorphs('causer')`, `event` indexed, `properties` json, timestamps with precision 6.
- `app/Http/Requests/ReasonRequest.php` — `reason` required, string, min 3, max 1000. Shared by every serious endpoint.
- `app/Support/AuditChanges.php` — old / new of dirty fields for `*.updated` events.
- `app/Support/AuditLog.php` — query, page, CSV writer, event prefixes.
- `AuditLogController` `index` + `export`, `AuditLogRequest` (authorize `audit.view`, filters `causer`, `event`, `from`, `to`).
- Routes `reports.audit`, `reports.audit.export`.

Code:

```php
final class AuditChanges
{
    public const int LongText = 200;

    /** @return array{changed: list<string>, old: array<string, mixed>, new: array<string, mixed>} */
    public static function of(Model $model, array $except = []): array
    {
        $dirty = array_diff_key($model->getDirty(), array_flip([...$except, 'created_at', 'updated_at']));
        $keys = array_keys($dirty);

        return [
            'changed' => $keys,
            'old' => array_combine($keys, array_map(fn (string $key): mixed => self::value($model->getRawOriginal($key)), $keys)),
            'new' => array_map(self::value(...), $dirty),
        ];
    }

    private static function value(mixed $value): mixed
    {
        return is_string($value) && mb_strlen($value) > self::LongText ? ['length' => mb_strlen($value)] : $value;
    }
}
```

Update Action: `$<model>->fill($data); $changes = AuditChanges::of($<model>); $<model>->save();` then `->withProperties($changes)`.

```php
public static function query(array $filters, User $viewer): Builder
{
    return Activity::query()->with('causer')->latest()->latest('id')
        ->when($filters['causer'] ?? null, fn (Builder $q, string $causer) => $q->where('causer_type', User::class)->where('causer_id', $causer))
        ->when($filters['event'] ?? null, fn (Builder $q, string $event) => $q->whereLike('event', addcslashes($event, '%_\\').'%'))
        ->when($filters['from'] ?? null, fn (Builder $q, string $from) => $q->where('created_at', '>=', UserTime::toUtc($from, $viewer)))
        ->when($filters['to'] ?? null, fn (Builder $q, string $to) => $q->where('created_at', '<', UserTime::toUtc($to, $viewer)->addDay()));
}
```

```php
public function export(AuditLogRequest $request): StreamedResponse
{
    $query = AuditLog::query($request->filters(), $request->user());

    return response()->streamDownload(
        fn () => AuditLog::write($query, new SplFileObject('php://output', 'w')),
        'audit-log-'.now()->format('Y-m-d').'.csv',
        ['Content-Type' => 'text/csv; charset=UTF-8'],
    );
}
```

- `write()`: BOM, header row from `__('audit.headers.*')`, `limit(MaxExportRows)`, every cell through `Csv::cell()` (prefix `'` when it starts with `= + - @ tab CR`).
- Index: filters + `Inertia::defer(fn () => AuditLog::page(...))`, 50 per page, `withQueryString()`. Times shown in viewer timezone; CSV in UTC.
- Event filter options = distinct prefixes before the first dot.
- Row label from lang: `Lang::has("audit.events.{$event}") ? __("audit.events.{$event}") : $event`. Keys in `lang/en/audit.php` + `lang/so/audit.php`; the raw event stays visible as metadata.
- Every row carries `via` (web / api / automation / agent) → `audit-channel.md`.
- Reason is required on reject, send back, disable, revoke, delete, lose. Stored as `withProperties(['reason' => …])`. Optional elsewhere.

Test:
- `AuditChanges`: changed, old, new for the touched fields only; long text logged as `{length}`.
- Audit page and export 403 without `audit.view`.
- Filters by person, event prefix, from, to (viewer timezone boundaries).
- Export is CSV, honours filters, defuses a causer named `=x`.
- Each serious endpoint: 422 without reason; reason lands in `properties.reason`.
- Known event shows its lang label in `en` and `so`; unknown event falls back to the raw name.

Gotchas:
- `subject_id` is uuid. Never `performedOn()` an int-id model (settings singletons, failed jobs, media). Log with no subject. SQLite tests pass; Postgres crashes.
- Timestamps need precision 6 (`$dateFormat = 'Y-m-d H:i:s.u'` on the model). Rows logged in one request tie otherwise and timelines reorder.
- Never log secrets, tokens, passwords, or full long text bodies.
- Stamp, never erase. No Action deletes or edits activity rows; retention via `activitylog:clean` only.
- Event names are a public contract (webhooks, automations, reports). Renaming one is a migration.

Harvested: 2026-10-08 (all from source; event labels from lang from standard)
