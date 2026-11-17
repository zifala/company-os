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
     * @param  list<string>  $columns  an empty list matches nothing
     * @return Builder<TModel>
     */
    public static function contains(Builder $query, array $columns, string $term): Builder
    {
        if ($columns === []) {
            // An empty nested where is dropped by the builder, which would match every row.
            return $query->whereRaw('1 = 0');
        }

        $driver = $query->getModel()->getConnection()->getDriverName();
        $grammar = $query->getQuery()->getGrammar();
        $operator = $driver === 'pgsql' ? 'ilike' : 'like';
        $pattern = '%'.self::escape($term, $driver).'%';
        $escape = self::escapeClause($driver);

        return $query->where(function (BuilderContract $any) use ($columns, $grammar, $operator, $pattern, $escape): void {
            foreach ($columns as $column) {
                $any->orWhereRaw($grammar->wrap($column)." {$operator} ?{$escape}", [$pattern]);
            }
        });
    }

    /**
     * The ` escape '\'` clause a LIKE needs for escape() to hold. SQLite and
     * sqlsrv have no default escape character; Postgres defaults to \ but
     * says so explicitly here. MySQL / MariaDB already use \, and '\' is not
     * a valid literal there, so they get none.
     */
    public static function escapeClause(string $driver): string
    {
        return in_array($driver, ['mysql', 'mariadb'], true) ? '' : " escape '\\'";
    }

    /** % _ \ (and [ on sqlsrv) escaped with \, after trimming. */
    public static function escape(string $term, string $driver = 'sqlite'): string
    {
        $characters = $driver === 'sqlsrv' ? '%_[\\' : '%_\\';

        return addcslashes(trim($term), $characters);
    }
}
