# Setup lists

Rule: anything a company may add to or rename is a row, not an enum. Simple lists share one `list_items` table; lists with extra columns get their own table and the same four Actions. Code never branches on a name — only on an immutable `code` or a `meaning`.

Decide:

| The set… | Becomes |
| --- | --- |
| Grows, admins rename, code does not branch on it (types, sources, relationships, ID types, methods) | `list_items` row |
| Same, but has its own columns or a tree (banks, locations, plans, categories) | own table + `Deactivatable` + reference Actions |
| Workflow stages a company renames or adds, code reacts to a few | `statuses` table with `meaning` |
| Code branches on every value, never renamed (status of a fixed flow, kind, gender, direction) | backed enum |
| Code needs one value of a list | pin its code as a constant (`ListName::REFERRAL`). Never turn the list back into an enum |

Shape:
- `app/Enums/ListName.php` — one case per list. `label()`, `uri()` (kebab), `fromUri()`, `uris()`.
- `list_items`: `id` uuid, `list` idx, `code`, `name` json (translatable), `meaning` nullable, `parent_id` nullable (one level), `position` int, `created_by`, `deactivated_at` idx, timestamps. `unique(list, code)`.
- `config/lists.php` — `list => [module?, parent?, meanings?, seed => [code => [en, <second language>]]]`.
- `app/Models/ListItem.php` — `code` = `Str::slug(english name, '_')` on `creating`, never changed. `rule(ListName)`, `options(ListName)`, `label(ListName, code)`.
- `app/Support/AsListCode.php` + `ListCode.php` — cast on record columns: `->label()`, `->is('code')`, serialises to the code.
- `app/Models/Concerns/Deactivatable.php` — `deactivated_at` cast, `active()`, `listed(status, search, columns)`, `isActive()`, `auditName()`.
- `app/Models/Contracts/ReferenceItem.php` — `isActive()`, `auditName()`.
- `app/Actions/Reference/` — `CreateReferenceItem`, `UpdateReferenceItem`, `DeactivateReferenceItem`, `ReactivateReferenceItem`, `ReorderReferenceItems` (whole ordered id list).
- `app/Actions/Setup/SeedLists.php` — seeds a list only while it has no rows. Called by `DatabaseSeeder`, the installer, and when a module is switched on.
- `app/Http/Controllers/Concerns/ManagesReferenceList.php` — `can:<area>.view|create|update|deactivate` per method, `filters()`, `abilities()`, deactivate / reactivate helpers.
- `ListItemController` — one controller for every simple list.
- Page `setup/lists/index` — header "+ Add", search + active / inactive filter, table, add / edit `FormDialog`, status toggle per row.

Code:

```php
enum ListName: string implements Labelled
{
    public const string REFERRAL = 'referral';

    case <Thing>Types = '<thing>_types';
    case Sources = 'sources';

    public function label(): string
    {
        return __("enums.list_name.{$this->value}");
    }

    public function uri(): string
    {
        return str_replace('_', '-', $this->value);
    }

    public static function fromUri(string $uri): self
    {
        return self::from(str_replace('-', '_', $uri));
    }

    /** @return list<string> */
    public static function uris(): array
    {
        return array_map(fn (self $list): string => $list->uri(), self::cases());
    }
}
```

```php
class ListItem extends Model implements ReferenceItem
{
    use Deactivatable, HasTranslations, HasUuids;

    /** @var list<string> */
    public array $translatable = ['name'];

    protected static function booted(): void
    {
        static::creating(function (ListItem $item): void {
            $item->code ??= Str::slug((string) $item->getTranslation('name', 'en'), '_');
        });
    }

    public static function rule(ListName $list): Exists
    {
        return (new Exists('list_items', 'code'))->where('list', $list->value)->whereNull('deactivated_at');
    }

    /** @return list<array{value: string, label: string}> */
    public static function options(ListName $list): array
    {
        return self::query()->active()->where('list', $list)->orderBy('position')->get()
            ->map(fn (ListItem $item): array => ['value' => $item->code, 'label' => $item->name])->values()->all();
    }

    public static function label(ListName $list, string $code): string
    {
        $items = once(fn () => self::query()->get()->keyBy(fn (ListItem $item): string => "{$item->list->value}.{$item->code}"));

        return $items->get("{$list->value}.{$code}")->name ?? Str::headline($code);
    }

    protected function casts(): array
    {
        return ['list' => ListName::class];
    }
}
```

```php
final class DeactivateReferenceItem
{
    /**
     * @template TItem of Model&ReferenceItem
     * @param TItem $item
     * @return TItem
     */
    public function handle(Model&ReferenceItem $item, User $actor): Model&ReferenceItem
    {
        if (! $item->isActive()) {
            throw ValidationException::withMessages(['item' => __('Already deactivated.')]);
        }

        $item->forceFill(['deactivated_at' => now()])->save();

        activity()->performedOn($item)->causedBy($actor)->event("{$item->auditName()}.deactivated")->log("{$item->auditName()}.deactivated");

        return $item;
    }
}
```

```php
Route::prefix('setup/lists/{list}')->whereIn('list', ListName::uris())->name('list-items.')->group(function () {
    Route::get('/', [ListItemController::class, 'index'])->name('index');
    Route::post('/', [ListItemController::class, 'store'])->name('store');
    Route::put('{listItem}', [ListItemController::class, 'update'])->name('update');
    Route::post('reorder', [ListItemController::class, 'reorder'])->name('reorder');
    Route::post('{listItem}/deactivate', [ListItemController::class, 'deactivate'])->name('deactivate');
    Route::post('{listItem}/reactivate', [ListItemController::class, 'reactivate'])->name('reactivate');
});

foreach ($ownTables as $group => $lists) {
    Route::prefix("setup/{$group}")->group(function () use ($lists) {
        foreach ($lists as $uri => [$controller, $parameter]) {
            Route::resource($uri, $controller)->only(['index', 'store', 'update'])->parameters([$uri => $parameter]);
            Route::post("{$uri}/{{$parameter}}/deactivate", [$controller, 'deactivate'])->name("{$uri}.deactivate");
            Route::post("{$uri}/{{$parameter}}/reactivate", [$controller, 'reactivate'])->name("{$uri}.reactivate");
        }
    });
}
```

Record side:
- Column stores the code string. No foreign key to `list_items`.
- Write: `'source' => ['required', ListItem::rule(ListName::Sources)]`.
- Read: cast `'source' => AsListCode::class.':sources'`. Props send `{value, label}`.
- Own-table lists: `foreignUuid()->constrained()->restrictOnDelete()`.

Statuses a company renames (when the flow needs it):
- `statuses`: `subject`, `name` json, `meaning`, `position`, scope id nullable. `config/statuses.php`: subject → model, column, meanings. Adding a meaning is a code change.
- Code reads `meaning`. Meaning locks once the status is in use. Deleting a used status needs a target with the same meaning; records move, then the delete is audited.
- `HasStatus::moveTo(Status, actor, note)` — refuses another subject's status, stamps `*_at` per meaning, logs `<subject>.status_changed` from → to.

Placement:
- Setup section nav, group "Lists" (simple lists) and one group per domain for own-table lists. See recipe `section-nav`.
- Per-scope lists (per department, per branch) live on that scope's settings page, grouped by module.
- Staff may suggest a new value; a manager approves, which calls `CreateReferenceItem`.

Test:
- Every list URI renders; an unknown URI 404s.
- A code survives a rename. A deactivated item is not in `options()` and fails `rule()`, but old records still show its label.
- Each route 403s without its permission (dataset).
- `SeedLists` twice → same rows. Seeding never touches an existing list.
- Duplicate name in the same list rejected, case-insensitive, deactivated rows counted.

Gotchas:
- Never delete a list item. Deactivate. Old records keep their code.
- Never branch on `name`. Rename breaks it.
- Defaults: seeded from `config/lists.php`, both languages.
- Picker short (≤ 7) → plain dropdown; longer → searchable combobox. Never native `<select>`.
- `options()` sorted by `position`, then name. Reorder sends the whole id list.
- List pages under `/setup` render inside the setup layout (section nav), never the bare app layout. A new list or integration page also gets its section-nav entry in the same change.

Harvested: 2026-10-18 (list_items, code + cast, reference Actions, routes from the first source; meaning, position, parent, statuses table, idempotent seeding, suggestions from the second)
