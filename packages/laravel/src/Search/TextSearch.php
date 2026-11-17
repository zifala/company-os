<?php

declare(strict_types=1);

namespace CompanyOs\Search;

use Illuminate\Contracts\Database\Eloquent\Builder as BuilderContract;
use Illuminate\Database\Eloquent\Builder;

/**
 * Recipe `command-palette`: "contains" search over literal columns.
 * `ilike` on pgsql, `like` elsewhere; % _ and \ in the term match literally.
 *
 * Column names are wrapped by the connection's grammar (the recipe's
 * hand-written "double quotes" break on MySQL without ANSI_QUOTES). Pass
 * literal column lists only, never user input.
 *
 * Postgres: add pg_trgm GIN indexes on searched columns. No search engine
 * until ILIKE + trigram is measurably slow.
 */
final class TextSearch
{
    /**
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  Builder<TModel>  $query
     * @param  list<string>  $columns
     * @return Builder<TModel>
     */
    public static function contains(Builder $query, array $columns, string $term): Builder
    {
        $driver = $query->getModel()->getConnection()->getDriverName();
        $grammar = $query->getQuery()->getGrammar();
        $operator = $driver === 'pgsql' ? 'ilike' : 'like';
        $pattern = '%'.self::escape($term, $driver).'%';
        // MySQL / MariaDB already use \ as the LIKE escape, and '\' is not a valid literal there.
        $escape = in_array($driver, ['mysql', 'mariadb'], true) ? '' : " escape '\\'";

        return $query->where(function (BuilderContract $any) use ($columns, $grammar, $operator, $pattern, $escape): void {
            foreach ($columns as $column) {
                $any->orWhereRaw($grammar->wrap($column)." {$operator} ?{$escape}", [$pattern]);
            }
        });
    }

    public static function escape(string $term, string $driver = 'sqlite'): string
    {
        $characters = $driver === 'sqlsrv' ? '%_[\\' : '%_\\';

        return addcslashes(trim($term), $characters);
    }
}
