<?php

declare(strict_types=1);

namespace CompanyOs\Support;

use Illuminate\Support\Facades\Lang;

/**
 * Lang lookup with an app-first fallback chain. Every user-facing string the
 * package produces goes through __(); nothing is a PHP constant.
 */
final class Label
{
    /**
     * First key that exists wins. When none exists, the last key's __() result
     * (the key itself, or $default when given) comes back.
     *
     * @param  list<string>  $keys
     * @param  array<string, mixed>  $replace
     */
    public static function first(array $keys, array $replace = [], ?string $default = null): string
    {
        foreach ($keys as $key) {
            if (Lang::has($key)) {
                return (string) __($key, $replace);
            }
        }

        return $default ?? (string) __((string) end($keys), $replace);
    }

    /** App key under a configured prefix, then the package's own key. */
    public static function appOrPackage(string $prefixConfig, string $file, string $key, array $replace = []): string
    {
        $prefix = (string) config("company-os.lang.{$prefixConfig}", $file);

        return self::first(["{$prefix}.{$key}", "company-os::{$file}.{$key}"], $replace);
    }

    /** App-only key under a configured prefix; falls back to the raw key so nothing renders blank. */
    public static function app(string $prefixConfig, string $default, string $key, array $replace = []): string
    {
        $full = config("company-os.lang.{$prefixConfig}", $default).'.'.$key;

        return Lang::has($full) ? (string) __($full, $replace) : $key;
    }
}
