<?php

declare(strict_types=1);

namespace CompanyOs\Trash;

use Carbon\CarbonInterface;
use CompanyOs\Support\Label;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Recipe `trash`: soft delete with a reason, a trash page listing what the
 * user may restore for 30 days, restore as its own Action, a daily purge.
 *
 * Register types in a service provider's boot():
 *   TrashBin::register(TrashType::make('clients', Client::class)->visibleWhen(...));
 *
 * Labels: app `trash.types.<key>`; guard messages: app `trash.<key>`, then the package's.
 */
final class TrashBin
{
    public const int Days = 30;

    /** @var array<string, TrashType> */
    private static array $types = [];

    public static function register(TrashType $type): void
    {
        self::$types[$type->key] = $type;
    }

    public static function flush(): void
    {
        self::$types = [];
    }

    /** @return array<string, TrashType> */
    public static function registered(): array
    {
        return self::$types;
    }

    /** Restore window in days: config('company-os.trash.days'), default Days (30). */
    public static function days(): int
    {
        return (int) config('company-os.trash.days', self::Days);
    }

    public static function cutoff(): CarbonInterface
    {
        return now()->subDays(self::days());
    }

    /**
     * Restore guard. Refuses a live record, one older than the window, and a
     * child whose parent is still in trash (pass the parent, trashed or not).
     *
     * @throws ValidationException on key `trash`
     */
    public static function ensureRestorable(Model $model, ?Model $parent = null): void
    {
        $deletedAt = self::deletedAt($model);

        if ($deletedAt === null) {
            throw ValidationException::withMessages(['trash' => self::message('not_in_trash')]);
        }

        if ($deletedAt->lt(self::cutoff())) {
            throw ValidationException::withMessages(['trash' => self::message('too_old', ['days' => self::days()])]);
        }

        if ($parent !== null && self::deletedAt($parent) !== null) {
            throw ValidationException::withMessages(['trash' => self::message('parent_in_trash')]);
        }
    }

    /** Computed here and sent ready; React never does date math. */
    public static function daysLeft(CarbonInterface $deletedAt): int
    {
        return max(0, self::days() - (int) floor(abs($deletedAt->diffInDays(now()))));
    }

    /** Id for a `deletion_batch` column: stamp parent + children deleted together, restore by it. */
    public static function newBatch(): string
    {
        return (string) Str::uuid();
    }

    /** @return list<array{key: string, label: string}> types the user may see, for the type filter */
    public static function types(mixed $user): array
    {
        $types = [];

        foreach (self::$types as $key => $type) {
            if ($type->isVisibleTo($user)) {
                $types[] = ['key' => $key, 'label' => Label::app('trash', 'trash', "types.{$key}")];
            }
        }

        return $types;
    }

    /**
     * Trash rows for the page: every visible type merged, newest deletion first,
     * paginated in memory; who + reason looked up for the current page only.
     *
     * @return LengthAwarePaginator<int, array{type: string, type_label: string, id: mixed, label: string, context: string|null, deleted_at: string, deleted_by: string|null, reason: string|null, days_left: int}>
     */
    public static function for(mixed $user, ?string $type = null, ?int $perPage = null, ?int $page = null): LengthAwarePaginator
    {
        $perPage ??= (int) config('company-os.trash.per_page', 25);
        $page ??= Paginator::resolveCurrentPage();
        $records = collect();

        foreach (self::$types as $key => $trashType) {
            if (($type !== null && $type !== $key) || ! $trashType->isVisibleTo($user)) {
                continue;
            }

            $records = $records->merge(self::trashedFor($trashType, $user)->map(fn (Model $record): array => [$trashType, $record]));
        }

        $sorted = $records->sortByDesc(fn (array $pair): int => self::deletedAt($pair[1])?->getTimestamp() ?? 0)->values();
        $slice = $sorted->forPage($page, $perPage)->values();
        $deletions = self::deletionsFor($slice);

        $rows = $slice->map(function (array $pair) use ($deletions): array {
            [$trashType, $record] = $pair;
            $mapped = $trashType->row !== null ? ($trashType->row)($record) : [];
            $deletion = $deletions[$record->getMorphClass()][(string) $record->getKey()] ?? null;
            $deletedAt = self::deletedAt($record) ?? now();

            return [
                'type' => $trashType->key,
                'type_label' => Label::app('trash', 'trash', "types.{$trashType->key}"),
                'id' => $record->getKey(),
                'label' => (string) ($mapped['label'] ?? $record->getAttribute('name') ?? $record->getKey()),
                'context' => $mapped['context'] ?? null,
                'deleted_at' => $deletedAt->toIso8601String(),
                'deleted_by' => $deletion['by'] ?? null,
                'reason' => $deletion['reason'] ?? null,
                'days_left' => self::daysLeft($deletedAt),
            ];
        });

        return new LengthAwarePaginator($rows->all(), $sorted->count(), $perPage, $page, [
            'path' => Paginator::resolveCurrentPath(),
            'pageName' => 'page',
        ]);
    }

    /** @return Collection<int, Model> */
    private static function trashedFor(TrashType $type, mixed $user): Collection
    {
        $query = $type->trashedQuery()->where($type->deletedAtColumn(), '>=', self::cutoff());

        if ($type->scope !== null) {
            $query = ($type->scope)($query, $user) ?? $query;
        }

        if ($type->parentColumn !== null && $type->parentModel !== null) {
            $column = $query->getModel()->qualifyColumn($type->parentColumn);
            $parents = ($type->parentModel)::query()->onlyTrashed()->select((new ($type->parentModel))->getKeyName());
            $query->where(fn ($roots) => $roots->whereNull($column)->orWhereNotIn($column, $parents));
        }

        $records = $query->get();

        return $type->recordVisible === null
            ? $records
            : $records->filter(fn (Model $record): bool => (bool) ($type->recordVisible)($record, $user))->values();
    }

    /**
     * Latest `*.deleted` activity per subject on the page: [morph class][subject id] => {by, reason}.
     *
     * @param  Collection<int, array{0: TrashType, 1: Model}>  $slice
     * @return array<string, array<string, array{by: string|null, reason: string|null}>>
     */
    private static function deletionsFor(Collection $slice): array
    {
        $activity = config('company-os.trash.activity_model') ?? config('activitylog.activity_model');

        if (! is_string($activity) || ! class_exists($activity) || $slice->isEmpty()) {
            return [];
        }

        $found = [];

        foreach ($slice->groupBy(fn (array $pair): string => $pair[1]->getMorphClass()) as $morph => $pairs) {
            $ids = $pairs->map(fn (array $pair): string => (string) $pair[1]->getKey())->all();

            $activity::query()->with('causer')
                ->where('subject_type', $morph)->whereIn('subject_id', $ids)->where('event', 'like', '%.deleted')
                ->orderByDesc('created_at')->orderByDesc('id')->get()
                ->each(function (Model $row) use (&$found, $morph): void {
                    $found[$morph][(string) $row->getAttribute('subject_id')] ??= [
                        'by' => data_get($row, 'causer.name'),
                        'reason' => data_get($row->getAttribute('properties'), 'reason'),
                    ];
                });
        }

        return $found;
    }

    /** Soft-delete timestamp, read from the model's own column (custom `DELETED_AT` included). */
    private static function deletedAt(Model $model): ?CarbonInterface
    {
        $column = method_exists($model, 'getDeletedAtColumn') ? $model->getDeletedAtColumn() : 'deleted_at';
        $value = $model->getAttribute($column);

        return match (true) {
            $value === null || $value === '' => null,
            $value instanceof CarbonInterface => $value,
            default => Carbon::parse($value),
        };
    }

    /** @param array<string, mixed> $replace */
    private static function message(string $key, array $replace = []): string
    {
        return Label::appOrPackage('trash', 'trash', $key, $replace);
    }
}
