# Onboarding

Rule: a record that starts a relationship is born only from an approved onboarding. One `onboardings` table serves every kind, the draft is the row, steps save one slice of JSON, a reviewer approves or sends back, and the same stepper serves staff and a guest link.

Shape:
- `app/Enums/OnboardingKind.php` — one case per record kind (`<party>`, `<child-party>`). `permission()` → `onboardings.<kind>`.
- `app/Enums/OnboardingStatus.php` — `draft`, `submitted`, `sent_back`, `approved`, `rejected`. `isEditable()` (draft, sent_back), `live()` (draft, submitted, sent_back), `tone()`, `label()`.
- `onboardings`: `id` uuid, `reference` unique (`Reference::next('ONB')`), `kind` idx, `status` idx, `source` idx (list code), `name`, `phone` idx (or the kind's natural key), `data` json, `created_by`, `submitted_at`, `reviewed_at`, `nullableUuidMorphs('subject')`, timestamps.
- `onboarding_links`: `id` uuid, `token_hash` string(64) unique, `onboarding_id` nullable cascade, `created_by`, fields the link fixes ahead, `expires_at`, `used_at`, `revoked_at`.
- `app/Support/OnboardingSteps.php` — per kind: `step => list<field>`. Plus `GUEST_STEPS`, `LINK_FIELDS` (fields the link fixes; guests never write them). Front end appends `documents` + `review`.
- `app/Support/OnboardingChecks.php` — `problems()` keyed by section, `progress()` → `{key, label, done}[]`. `match(kind)` to a per-kind checks class.
- `app/Actions/Onboarding/` — `StartOnboarding`, `SaveOnboarding`, `UploadOnboardingDocument`, `SubmitOnboarding`, `ApproveOnboarding`, `SendBackOnboarding`, `RejectOnboarding`, `GenerateOnboardingLink`.
- `app/Actions/<Party>/Onboard<Party>.php` — one per kind. Creates the record + its children from `data`. Called only by `ApproveOnboarding`.
- `app/Support/OnboardingDocuments.php` — `move($onboarding, $party, $owner)`: media `<party>.<doc>` on the onboarding → `<doc>` on the record.
- Controllers: `OnboardingController` (index, create, store, show, saveStep), `OnboardingReviewController` (submit, approve, send-back, reject), `OnboardingLinkController`, `GuestOnboardingController`.
- Pages: `onboardings/index` (list, filter by kind + status), `onboardings/create` (start: kind, source, natural key), `onboardings/stepper` (edit), `onboardings/show-<kind>` (read-only review).

Code:

```php
final class SaveOnboarding
{
    /** @param array<string, mixed> $input */
    public function handle(Onboarding $onboarding, ?User $actor, string $step, array $input, ?OnboardingLink $link = null): Onboarding
    {
        return DB::transaction(function () use ($onboarding, $actor, $step, $input, $link): Onboarding {
            $onboarding = $onboarding->lockForChange();

            if (! $onboarding->status->isEditable()) {
                throw ValidationException::withMessages(['status' => __('Only a draft or sent-back onboarding can be changed')]);
            }

            $fields = OnboardingSteps::fieldsFor($onboarding->kind);

            if (! array_key_exists($step, $fields)) {
                throw ValidationException::withMessages(['step' => __('This step does not belong to this onboarding')]);
            }

            $party = $onboarding->kind->value;
            $allowed = $link ? array_diff($fields[$step], OnboardingSteps::LINK_FIELDS) : $fields[$step];
            $data = $onboarding->data;
            $data[$party] = [...$data[$party], ...Arr::only((array) ($input[$party] ?? []), $allowed)];

            $onboarding->forceFill(['name' => $data[$party]['name'] ?? $onboarding->name, 'data' => $data])->save();

            activity()->performedOn($onboarding)->causedBy($actor)->event('onboarding.step_saved')
                ->withProperties(array_filter(['step' => $step, ...OnboardingLinkContext::of($link)]))->log('onboarding.step_saved');

            return $onboarding;
        });
    }
}
```

```php
final class ApproveOnboarding
{
    public function __construct(private Onboard<Party> $onboard<Party>, private Onboard<ChildParty> $onboard<ChildParty>) {}

    public function handle(Onboarding $onboarding, User $actor): Onboarding
    {
        $subject = DB::transaction(function () use ($onboarding, $actor): Model {
            $onboarding = $onboarding->lockForChange();

            if ($onboarding->status !== OnboardingStatus::Submitted) {
                throw ValidationException::withMessages(['status' => __('Only an onboarding waiting for review can be approved')]);
            }

            if ($onboarding->created_by === $actor->id && $actor->cannot('onboardings.approve-own')) {
                throw ValidationException::withMessages(['status' => __('You may not approve an onboarding you started')]);
            }

            $problems = OnboardingChecks::problems($onboarding);

            if ($problems !== []) {
                throw ValidationException::withMessages($problems);
            }

            $subject = match ($onboarding->kind) {
                OnboardingKind::<Party> => $this->onboard<Party>->handle($onboarding, $actor),
                OnboardingKind::<ChildParty> => $this->onboard<ChildParty>->handle($onboarding, $actor),
            };

            $onboarding->forceFill(['status' => OnboardingStatus::Approved, 'reviewed_at' => now()])->subject()->associate($subject)->save();

            activity()->performedOn($onboarding)->causedBy($actor)->event('onboarding.approved')
                ->withProperties(["{$onboarding->kind->value}_id" => $subject->getKey()])->log('onboarding.approved');

            return $subject;
        });

        // welcome message / mail here, after commit

        return $onboarding->refresh();
    }
}
```

```php
#[Hidden(['token_hash'])]
class OnboardingLink extends Model
{
    use HasUuids;

    public const int LIFETIME_HOURS = 24;

    public static function hash(string $token): string
    {
        return hash('sha256', $token);
    }

    public static function findLive(string $token): ?self
    {
        return self::query()->live()->where('token_hash', self::hash($token))->first();
    }

    #[Scope]
    protected function live(Builder $query): void
    {
        $query->whereNull('used_at')->whereNull('revoked_at')->where('expires_at', '>', now());
    }
}
```

```php
Route::prefix('guest/onboarding/{token}')->middleware('throttle:60,1')->name('guest.onboarding.')->group(function () {
    Route::get('/', [GuestOnboardingController::class, 'show'])->name('show');
    Route::post('start', [GuestOnboardingController::class, 'start'])->name('start');
    Route::put('steps/{step}', [GuestOnboardingController::class, 'saveStep'])->whereIn('step', OnboardingSteps::GUEST_STEPS)->name('steps.update');
    Route::post('documents', [GuestOnboardingController::class, 'upload'])->name('documents.store');
    Route::post('submit', [GuestOnboardingController::class, 'submit'])->name('submit');
});

Route::prefix('{onboarding}')->name('onboardings.')->group(function () {
    Route::get('/', [OnboardingController::class, 'show'])->name('show');
    Route::put('steps/{step}', [OnboardingController::class, 'saveStep'])->whereIn('step', OnboardingSteps::names())->name('steps.update');
    Route::post('links', [OnboardingLinkController::class, 'store'])->name('links.store');
    Route::post('submit', [OnboardingReviewController::class, 'submit'])->name('submit');
    Route::post('approve', [OnboardingReviewController::class, 'approve'])->name('approve');
    Route::post('send-back', [OnboardingReviewController::class, 'sendBack'])->name('send-back');
    Route::post('reject', [OnboardingReviewController::class, 'reject'])->name('reject');
});
```

```ts
export function onboardingUrls(id: string, guestToken?: string) {
    return guestToken
        ? { step: (s: string) => guest.onboarding.steps.update([guestToken, s]), upload: guest.onboarding.documents.store(guestToken), submit: guest.onboarding.submit(guestToken) }
        : { step: (s: string) => onboardings.steps.update([id, s]), upload: onboardings.documents.store(id), submit: onboardings.submit(id) };
}
```

Flow:

| Action | From → to | Who |
| --- | --- | --- |
| Start | → `draft` | `onboardings.<kind>` |
| Save step | `draft` / `sent_back` stays | owner, or guest via link |
| Submit | `draft` / `sent_back` → `submitted` | owner, or guest (link `used_at`) |
| Approve | `submitted` → `approved`, record created | `onboardings.review`; own one also needs `onboardings.approve-own` |
| Send back (reason) | `submitted` → `sent_back` | `onboardings.review` |
| Reject (reason) | `submitted` → `rejected` | `onboardings.review` |

Nested kinds (a child party such as a guarantor, a contact, a director):
- Standalone: its own `kind`, own steps, approve creates the child record alone.
- Inside the parent: `data.<children>[]` entries `{key, type, <child>_id?, profile{…}}`. `<child>_id` set → reuse an existing record found by natural key, profile not required. Else profile validated per entry. `distinct` on the natural key, `max:` on the count.
- Both paths call the same `Create<Child>` Action, the same required-document list, the same person-section components with a `prefix` prop (`<party>`, `<child>`, `<children>.N.profile`). Errors keyed by that dotted path.
- Simple nesting with no review (parent + one optional child at create): one Action, one transaction, a "pick existing" combobox that hides the new-child fields, a duplicate notice with "create anyway".

Placement:
- Sidebar: "New onboarding" button under the logo. Top group: Onboarding, Onboarding review (list filtered `?status=submitted`).
- Record lists have "Onboard <party>" → `onboardings.create?kind=<kind>`. No "Create <party>" route: record resources `->except(['create', 'store', 'destroy'])`.
- Stepper: full screen, thin header with Exit. Left rail: reference, name, status chip, steps (locked beyond the furthest reached unless done). Main: step title + Back / "Confirm and continue". Review step lists server `problems`, then "Submit for review". Banner shows the send-back reason.
- Review page: form layout, header actions Reject · Send back (reason dialogs) · Approve (confirm dialog stating the consequence). Side cards: progress, source.
- Record page: an "Onboarding" side card — reference (link), started by, approved by, approved on, source.

Test:
- Each transition from every wrong status fails with a field error (dataset).
- Saving a step writes only that step's fields; a guest cannot write `LINK_FIELDS`.
- Approve creates the record, moves documents, links `subject`, logs `onboarding.approved`. Problems block approve.
- Starter approves own onboarding only with `onboardings.approve-own`.
- Link: expired, used, revoked → expired page. A new link revokes the old one. Token never in a response or log.
- Agents see only their own onboardings unless they hold `view_all` or `review`.
- No route creates a record outside onboarding.

Gotchas:
- Reason lives in the activity log `properties.reason`, never a column. The page reads the latest `sent_back` / `rejected` entry.
- Presenter fills every `data` key with a default, so the front-end type is one shape for all kinds.
- One live onboarding per natural key. Start refuses when a record or a live onboarding already has it.
- Documents attach to the onboarding until approve, then move. Guests get no download URL.
- Guest actions log `via=guest_link`, link id, IP, UA. Mask the token in any logged URL.
- Messages and mail after commit, never inside the transaction.
- Adding a kind = enum case + steps map + checks class + `Onboard<Party>` + `match` arms. Nothing else.

Harvested: 2026-10-18 (onboarding, link, nested child from the first source; approve-own permission and inline pick-existing from the second)
