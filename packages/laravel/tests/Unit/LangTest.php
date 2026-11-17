<?php

declare(strict_types=1);

/** @return array<string, mixed> */
function langFile(string $locale, string $file): array
{
    return require __DIR__."/../../lang/{$locale}/{$file}";
}

/** @return list<string> */
function langKeys(array $lines, string $prefix = ''): array
{
    $keys = [];

    foreach ($lines as $key => $value) {
        $keys = is_array($value) ? [...$keys, ...langKeys($value, "{$prefix}{$key}.")] : [...$keys, "{$prefix}{$key}"];
    }

    sort($keys);

    return $keys;
}

$files = array_map('basename', glob(__DIR__.'/../../lang/en/*.php') ?: []);

it('ships the same files in en and so', function () use ($files): void {
    expect($files)->not->toBeEmpty()
        ->and(array_map('basename', glob(__DIR__.'/../../lang/so/*.php') ?: []))->toBe($files);
});

it('has the same keys and placeholders in en and so', function (string $file): void {
    $en = Illuminate\Support\Arr::dot(langFile('en', $file));
    $so = Illuminate\Support\Arr::dot(langFile('so', $file));

    expect(langKeys(langFile('so', $file)))->toBe(langKeys(langFile('en', $file)));

    foreach ($en as $key => $line) {
        preg_match_all('/:\w+/', $line, $enPlaceholders);
        preg_match_all('/:\w+/', $so[$key], $soPlaceholders);

        expect($soPlaceholders[0])->toBe($enPlaceholders[0], "{$file}: {$key}");
    }
})->with($files);

it('marks every Somali file as needing review', function (string $file): void {
    expect(file_get_contents(__DIR__."/../../lang/so/{$file}"))->toContain('NEEDS REVIEW');
})->with($files);
