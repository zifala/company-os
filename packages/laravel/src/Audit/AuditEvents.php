<?php

declare(strict_types=1);

namespace CompanyOs\Audit;

use CompanyOs\Search\TextSearch;
use CompanyOs\Support\Label;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Recipe `audit`: event names are `<noun>.<verb_past>` and a public contract.
 * Labels come from the app's `lang/<locale>/audit.php` under `events`; an
 * unknown event falls back to the raw name, which stays visible as metadata.
 */
final class AuditEvents
{
    public static function label(string $event): string
    {
        return Label::app('audit_events', 'audit.events', $event);
    }

    /** Filter option for an event: the part before the first dot. */
    public static function prefix(string $event): string
    {
        return explode('.', $event, 2)[0];
    }

    /**
     * Distinct prefixes of a list of event names, sorted.
     *
     * @param  iterable<string>  $events
     * @return list<string>
     */
    public static function prefixes(iterable $events): array
    {
        $prefixes = [];

        foreach ($events as $event) {
            $prefixes[self::prefix($event)] = true;
        }

        $keys = array_map('strval', array_keys($prefixes));
        sort($keys, SORT_STRING);

        return $keys;
    }

    /**
     * LIKE pattern for an event-prefix filter, wildcards escaped with \.
     * Postgres and MySQL read \ as the escape by default, so
     * `whereLike('event', AuditEvents::likePrefix($filter))` works there.
     * SQLite and sqlsrv do not: use wherePrefix(), which works on every driver.
     */
    public static function likePrefix(string $prefix): string
    {
        return addcslashes($prefix, '%_\\').'%';
    }

    /**
     * Event-prefix filter on any driver: `event like 'client%' escape '\'`.
     *
     * @template TQuery of EloquentBuilder<*>|QueryBuilder
     *
     * @param  TQuery  $query
     * @return TQuery
     */
    public static function wherePrefix(EloquentBuilder|QueryBuilder $query, string $prefix, string $column = 'event'): EloquentBuilder|QueryBuilder
    {
        $base = $query instanceof EloquentBuilder ? $query->getQuery() : $query;
        $driver = $base->getConnection()->getDriverName();

        return $query->whereRaw(
            $base->getGrammar()->wrap($column).' like ?'.TextSearch::escapeClause($driver),
            [TextSearch::escape($prefix, $driver).'%'],
        );
    }
}
