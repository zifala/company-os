<?php

declare(strict_types=1);

namespace CompanyOs\Search;

use Closure;
use CompanyOs\Support\Label;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * Recipe `command-palette`: the server decides what records show. One
 * GlobalSearch feeds the palette route, any API and any MCP search.
 *
 * Register groups in a service provider's boot(). The query closure returns
 * the same scoped query as the group's index page (visibleTo + view-any),
 * or null when the user may not see the group at all:
 *
 *   GlobalSearch::group('clients',
 *       query: fn (User $user) => $user->can('clients.view-any') ? Client::query()->visibleTo($user) : null,
 *       columns: ['name', 'email'],
 *       map: fn (Client $row) => ['id' => $row->id, 'label' => $row->name, 'url' => route('clients.show', $row)],
 *       code: 'number',
 *   );
 *
 * Group names: app `search.groups.<key>`. The palette is the easiest leak:
 * every group must use the same visibility as its index page.
 */
final class GlobalSearch
{
    public const int MinLength = 2;

    public const int PerGroup = 5;

    /** @var array<string, array{query: Closure, columns: list<string>, map: Closure, code: string|null}> */
    private static array $groups = [];

    /**
     * @param  Closure(mixed): (Builder<Model>|null)  $query
     * @param  list<string>  $columns
     * @param  Closure(Model): array{id: mixed, label: string, url: string}  $map
     * @param  string|null  $code  human code column (invoice number, SKU): an exact match ranks first
     */
    public static function group(string $key, Closure $query, array $columns, Closure $map, ?string $code = null): void
    {
        self::$groups[$key] = ['query' => $query, 'columns' => array_values($columns), 'map' => $map, 'code' => $code];
    }

    public static function flush(): void
    {
        self::$groups = [];
    }

    /** @return list<array{key: string, name: string, items: list<array{id: mixed, label: string, url: string}>}> */
    public static function groups(mixed $user, string $term): array
    {
        $term = trim($term);

        if (mb_strlen($term) < self::MinLength) {
            return [];
        }

        $results = [];

        foreach (self::$groups as $key => $group) {
            $query = ($group['query'])($user);

            if ($query === null) {
                continue;
            }

            $items = self::top($query, $group['columns'], $term, $group['code'])->map($group['map'])->values();

            if ($items->isNotEmpty()) {
                $results[] = ['key' => $key, 'name' => Label::app('search_groups', 'search.groups', $key), 'items' => $items->all()];
            }
        }

        return $results;
    }

    /**
     * @param  Builder<Model>  $query
     * @param  list<string>  $columns
     * @return Collection<int, Model>
     */
    private static function top(Builder $query, array $columns, string $term, ?string $code): Collection
    {
        $columns = $code !== null && ! in_array($code, $columns, true) ? [...$columns, $code] : $columns;
        $query = TextSearch::contains($query, $columns, $term);
        $model = $query->getModel();

        if ($code !== null) {
            $query->orderByRaw('case when lower('.$query->getQuery()->getGrammar()->wrap($code).') = ? then 0 else 1 end', [mb_strtolower($term)]);
        }

        $model->usesTimestamps() && $model->getUpdatedAtColumn() !== null
            ? $query->latest($model->getQualifiedUpdatedAtColumn())
            : $query->orderByDesc($model->getQualifiedKeyName());

        return $query->limit(self::PerGroup)->get();
    }
}
