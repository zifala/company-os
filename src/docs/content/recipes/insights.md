# Insights

Rule: a rule signal raises at most one live insight per kind + scope; people see it in an inbox, acknowledge it, dismiss it with a reason (then it stays quiet 7 days), or apply its suggestion, which runs the normal Action.

Shape:
- Rules that produce `Signal` values, the schedule, and the reminder side → `signals.md`. This recipe owns the inbox.
- `Signal` gains `suggestions` (list of suggestion rows) and `evidenceRows()` (records → `{text, links: [{label, href}]}`).
- `insights`: uuid `id`, `kind`, `severity`, `status`, `scope_type` + `scope_id` (nullable uuid morph; null = workspace), `title`, `body`, `evidence` json, `suggestions` json, `resolved_by`, `resolved_at`, timestamps. Index (`kind`, `scope_type`, `scope_id`, `status`).
- `app/Enums/InsightKind.php` — one case per rule; `label()` from lang; `permission()` for workspace-scoped kinds.
- `app/Enums/InsightSeverity.php` — `Info`, `Warning`, `Critical`; `label()`, `tone()`, `rank()`.
- `app/Enums/InsightStatus.php` — `Open`, `Acknowledged`, `Dismissed`, `Applied`, `Resolved`; `Live = [Open, Acknowledged]`; `isLive()`.
- `app/Enums/SuggestionType.php` — one case per Action a suggestion may run; `needs(): list<string>` ids it carries.
- `app/Models/Insight.php` — `scopeLive`, `scopeVisibleTo(User)` (scope record's own `visibleTo`; person scope = that person; workspace = `kind->permission()`), `scope()` morphTo.
- `app/Actions/Insight/` — `RecordInsight`, `ClearStaleInsights`, `AcknowledgeInsight`, `DismissInsight`, `ApplySuggestion`.
- `app/Support/InsightOwners.php` — who is notified on raise: the scope's owner / managers; workspace → holders of `kind->permission()`; always filtered by `visibleTo`.
- Routes: `insights.index` (GET `/insights?severity=&kind=`), `insights.acknowledge|dismiss|apply` (POST `/insights/{insight}/…`). Dismiss uses `ReasonRequest`.
- Page `pages/insights/index.tsx`: deferred list, severity-ordered, filters in the query string; each row: severity pill, title, scope link, evidence lines with record links, suggestions with "Apply" buttons, "Dismiss" → ReasonDialog. Scope pages embed the same list filtered to that scope.
- Shared prop `insights.open_count` for the sidebar badge.

Code:

```php
final class RecordInsight
{
    public const int DismissedQuietDays = 7;

    public function handle(Signal $signal): ?Insight
    {
        $same = Insight::query()->where('kind', $signal->kind)
            ->where('scope_type', $signal->scope?->getMorphClass())->where('scope_id', $signal->scope?->getKey());

        if ((clone $same)->where('status', InsightStatus::Dismissed)->where('resolved_at', '>=', now()->subDays(self::DismissedQuietDays))->exists()) {
            return null;
        }

        $values = ['severity' => $signal->severity, 'title' => $signal->title, 'body' => $signal->body, 'evidence' => $signal->evidenceRows()];
        $live = (clone $same)->live()->latest()->first();

        if ($live !== null) {
            $live->update([...$values, 'suggestions' => self::keepApplied($signal->suggestions, $live->suggestions)]);

            return $live;
        }

        $insight = Insight::query()->create([...$values, 'suggestions' => $signal->suggestions, 'kind' => $signal->kind,
            'scope_type' => $signal->scope?->getMorphClass(), 'scope_id' => $signal->scope?->getKey(), 'status' => InsightStatus::Open]);

        activity()->performedOn($insight)->event('insight.raised')
            ->withProperties(['kind' => $insight->kind->value, 'severity' => $insight->severity->value])->log('insight.raised');

        Notification::send(InsightOwners::of($insight), new InsightNotification($insight));

        return $insight;
    }
}
```

```php
public function handle(Insight $insight, User $actor, int $index): Insight
{
    Gate::forUser($actor)->authorize('view', $insight);

    return DB::transaction(function () use ($insight, $actor, $index): Insight {
        $insight = Insight::query()->lockForUpdate()->findOrFail($insight->id);
        $suggestion = $this->liveSuggestion($insight, $index);

        try {
            ActivityChannel::during(ActivityChannel::Agent, $insight->id, fn () => $this->apply(SuggestionType::from($suggestion['type']), $suggestion, $actor));
        } catch (ModelNotFoundException) {
            throw ValidationException::withMessages(['suggestion' => __('insights.record_deleted')]);
        }

        $suggestions = $insight->suggestions;
        $suggestions[$index] = [...$suggestion, 'applied_at' => now()->toIso8601String(), 'applied_by' => $actor->id];
        $done = collect($suggestions)->every(fn (array $each): bool => $each['applied_at'] !== null);

        $insight->update(['suggestions' => $suggestions, ...($done ? ['status' => InsightStatus::Applied, 'resolved_by' => $actor->id, 'resolved_at' => now()] : [])]);

        activity()->performedOn($insight)->causedBy($actor)->event('insight.suggestion_applied')
            ->withProperties(['type' => $suggestion['type'], 'label' => $suggestion['label']])->log('insight.suggestion_applied');

        return $insight;
    });
}
```

```php
/** @param list<string> $touchedIds */
public function handle(InsightKind $kind, array $touchedIds): void
{
    Insight::query()->live()->where('kind', $kind)->whereNotIn('id', $touchedIds)->get()
        ->each(function (Insight $insight): void {
            $insight->update(['status' => InsightStatus::Resolved, 'resolved_at' => now()]);
            activity()->performedOn($insight)->event('insight.cleared')->log('insight.cleared');
        });
}
```

- `apply()` is a `match` over `SuggestionType` calling the real Action (`Assign<Model>`, `Reschedule<Model>`, `Create<Model>`) as the clicking user. The Action's own guards and audit run.
- Suggestion row: `type`, `label`, `reason`, the ids in `needs()`, `applied_at`, `applied_by`. `keepApplied` keeps the applied mark of a same-label suggestion across re-raise.
- Signals job: per kind, raise every signal, collect touched ids, then `ClearStaleInsights`. Rule no longer fires → live insight `resolved`.
- `AcknowledgeInsight`: `Open` only → `Acknowledged`, audit `insight.acknowledged`. Opening the inbox does not acknowledge.
- `DismissInsight`: live only, reason 3–500, sets `resolved_by` / `resolved_at`, audit `insight.dismissed` + reason.
- Notification event `insight_raised` goes through the normal matrix; text from lang.

Test:
- Same kind + scope twice → one row, updated in place, one `insight.raised`, one notification.
- Dismissed within 7 days → nothing raised; day 8 → raised again.
- Rule stops firing → live insight `resolved`, `insight.cleared`. Dismissed / applied rows untouched.
- Acknowledge: open → seen once; second time 422; non-viewer 403.
- Dismiss: needs reason; closed insight 422; reason in `properties.reason`.
- Apply: runs the target Action as the actor, row stamped `via: agent` + insight id; second apply 422; deleted record 422; missing index 422; all applied → `Applied`.
- Each `SuggestionType` runs its own Action (dataset).
- Inbox lists only `visibleTo` insights; another scope's insight 404 on every POST.
- Filters `severity`, `kind` from the query string.

Gotchas:
- Dedupe key is kind + scope, including `scope_type`. Null scope = one workspace insight per kind.
- `lockForUpdate` inside the transaction; two clicks must not run the Action twice.
- The rule decides whether an insight exists. An AI writer may rewrite title / body / suggestions, never raise or clear.
- Title, body, evidence text, labels → `__()` with placeholders, rendered at raise time in the app locale; store keys + params if users switch locale often.
- Suggestions carry record ids, never URLs; `apply()` loads them fresh, so the target Action's own policy decides access.
- Evidence links are a snapshot. Render them only to viewers who pass `visibleTo` on the insight.
- Quiet days, thresholds → named constants + `docs/business-logic/insights.md`.

Harvested: 2026-10-08 (dedupe, quiet period, apply, clear stale, visibility from source; inbox page, filters, open count, ActivityChannel, lang from standard)
