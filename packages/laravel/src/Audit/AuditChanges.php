<?php

declare(strict_types=1);

namespace CompanyOs\Audit;

use Illuminate\Database\Eloquent\Model;

/**
 * Recipe `audit`: old / new of the dirty fields for `*.updated` events.
 *
 *   $record->fill($data);
 *   $changes = AuditChanges::of($record);
 *   $record->save();
 *   activity()->...->withProperties($changes)->log('record.updated');
 *
 * Call it after fill() and before save(): after save nothing is dirty.
 */
final class AuditChanges
{
    /** Strings longer than this are logged as {length}, never as the full body. */
    public const int LongText = 200;

    /**
     * @param  list<string>  $except  extra keys to leave out (secrets, tokens, passwords)
     * @return array{changed: list<string>, old: array<string, mixed>, new: array<string, mixed>}
     */
    public static function of(Model $model, array $except = []): array
    {
        $dirty = array_diff_key($model->getDirty(), array_flip([...$except, ...$model->getHidden(), 'created_at', 'updated_at']));
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
