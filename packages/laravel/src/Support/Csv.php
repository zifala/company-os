<?php

declare(strict_types=1);

namespace CompanyOs\Support;

use SplFileObject;

/**
 * Recipe `audit` (export) and `views-import-export`: CSV that opens safely in
 * a spreadsheet. Every cell goes through cell(): a value starting with
 * = + - @ tab or CR gets a leading ' so it is never run as a formula.
 */
final class Csv
{
    public const string Bom = "\u{FEFF}";

    /** @var list<string> */
    public const array DangerousPrefixes = ['=', '+', '-', '@', "\t", "\r"];

    public static function cell(mixed $value): string
    {
        $value = match (true) {
            $value === null => '',
            is_bool($value) => $value ? '1' : '0',
            $value instanceof \DateTimeInterface => $value->format('Y-m-d H:i:s'),
            $value instanceof \BackedEnum => (string) $value->value,
            $value instanceof \UnitEnum => $value->name,
            is_array($value) => (string) json_encode($value, JSON_UNESCAPED_UNICODE),
            default => (string) $value,
        };

        return $value !== '' && in_array($value[0], self::DangerousPrefixes, true) ? "'".$value : $value;
    }

    /**
     * Write BOM + header + rows. Each row is defused cell by cell.
     *
     * @param  list<string>  $headers
     * @param  iterable<array<array-key, mixed>>  $rows
     */
    public static function write(SplFileObject $file, array $headers, iterable $rows): void
    {
        $file->fwrite(self::Bom);
        self::row($file, $headers);

        foreach ($rows as $row) {
            self::row($file, $row);
        }
    }

    /** @param  array<array-key, mixed>  $cells */
    public static function row(SplFileObject $file, array $cells): void
    {
        $file->fputcsv(array_map(self::cell(...), array_values($cells)), ',', '"', '');
    }
}
