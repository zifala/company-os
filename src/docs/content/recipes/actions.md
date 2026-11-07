# Actions

Rule: one business verb = one Action that guards, writes, audits and notifies; the controller only validates, calls it, redirects.

Shape:
- `app/Actions/<Model>/<Verb><Noun>.php` — `final class`, one public `handle()`. Real process word: `Close<Model>`, `Lose<Model>`, never `Update<Model>Status`.
- Args: subject, actor, data. Create Actions: actor, data. Returns the subject.
- Shared checks used by 2+ Actions → `app/Actions/<Model>/<Model>Guards.php` (static or injected), not a base class.
- Other Actions are constructor-injected and called, never copied: `Win<Model>` calls `Create<Other>`.
- Controller method: Form Request → `$action->handle($subject, $request->user(), $request->validated())` → `back()` / `to_route()`.
- Every status change has its own route: `POST /<models>/{<model>}/<verb>` → `<models>.<verb>`.

Code:

```php
final class Lose<Model>
{
    /** @param array{reason: string} $data */
    public function handle(<Model> $<model>, User $actor, array $data): <Model>
    {
        Gate::forUser($actor)->authorize('update', $<model>);

        return DB::transaction(function () use ($<model>, $actor, $data): <Model> {
            $<model> = <Model>::query()->lockForUpdate()->findOrFail($<model>->id);

            if ($<model>->status === <Model>Status::Lost) {
                throw ValidationException::withMessages(['status' => __('<module>.already_lost')]);
            }

            $<model>->update(['status' => <Model>Status::Lost, 'closed_at' => now(), 'lost_reason' => $data['reason']]);

            activity()->performedOn($<model>)->causedBy($actor)->event('<model>.lost')
                ->withProperties(['reason' => $data['reason']])->log('<model>.lost');

            return $<model>;
        });
    }
}
```

```php
public function lose(ReasonRequest $request, <Model> $<model>, Lose<Model> $lose<Model>): RedirectResponse
{
    $lose<Model>->handle($<model>, $request->user(), $request->validated());

    return back();
}
```

Notify inside the Action, after the audit line, skipping the actor:

```php
if ($assignee !== null && $assignee->id !== $actor->id) {
    $this->notify->handle($<model>, $actor, NotificationEvent::<Model>Assigned);
}
```

- Authorize in the Action with `Gate::forUser($actor)`, not only in the controller. Same Action serves web, API, MCP, automations, imports.
- No-op guard first: same value as before → return the subject, log nothing.
- Edit Actions whitelist fields: `Arr::only($data, self::Editable)`.
- Idempotent create / close from flaky clients: accept `idempotency_key`, store it, return early on a repeat.

Test:
- Feature test per Action under `tests/Feature/Actions/<Model>Test.php`, calling `app(<Verb><Noun>::class)->handle(...)`.
- Happy path: state changed, one activity row with the right event and properties.
- Guard: wrong state → `ValidationException` on the named field, nothing written, no activity row.
- Authorization: actor without the permission → `AuthorizationException`.
- HTTP test per route: forbidden for outsiders, 422 without required data, redirect on success.
- Notify: the subject's people get it, the actor does not (`Notification::fake()`); guard failure notifies nobody.

Gotchas:
- Lock the row (`lockForUpdate` inside the transaction) before checking state, or two clicks pass the same guard.
- Notifications use `afterCommit()` so a rollback sends nothing.
- Guard messages come from `lang/en` + `lang/so` via `__()`. Never a literal string.
- Validation lives in the Form Request; the Action re-checks only business rules (state, ownership, active users).
- Keep each Action ≤ 150 lines. Bigger → split the verb or move checks to `<Model>Guards`.

Harvested: 2026-10-08 (all from source; notify test from standard)
