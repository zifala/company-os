<?php

declare(strict_types=1);

use CompanyOs\Support\Csv;

it('defuses cells that a spreadsheet would run as a formula', function (string $value): void {
    expect(Csv::cell($value))->toBe("'".$value);
})->with(['=x', '=SUM(A1:A2)', '+1', '-1', '@cmd', "\tx", "\rx"]);

it('leaves safe cells alone and stringifies scalars', function (): void {
    expect(Csv::cell('Acme'))->toBe('Acme')
        ->and(Csv::cell('a=b'))->toBe('a=b')
        ->and(Csv::cell(''))->toBe('')
        ->and(Csv::cell(null))->toBe('')
        ->and(Csv::cell(12))->toBe('12')
        ->and(Csv::cell(true))->toBe('1')
        ->and(Csv::cell(['a' => 1]))->toBe('{"a":1}');
});

it('writes a BOM, a header row and defused rows', function (): void {
    $file = new SplFileObject('php://memory', 'w+');

    Csv::write($file, ['When', 'Who', 'Event'], [['2026-01-01 10:00:00', '=x', 'client.deleted']]);

    $file->rewind();
    $out = '';
    while (! $file->eof()) {
        $out .= $file->fgets();
    }

    expect($out)->toStartWith("\u{FEFF}")
        ->and($out)->toContain("When,Who,Event\n")
        ->and($out)->toContain("\"2026-01-01 10:00:00\",'=x,client.deleted");
});

it('stringifies dates, enums and floats', function (): void {
    expect(Csv::cell(new DateTimeImmutable('2026-01-31 09:05:00')))->toBe('2026-01-31 09:05:00')
        ->and(Csv::cell(CompanyOs\Tests\Fixtures\Stage::Won))->toBe('won')
        ->and(Csv::cell(CompanyOs\Tests\Fixtures\Stage::Lost))->toBe("'=lost")
        ->and(Csv::cell(CompanyOs\Tests\Fixtures\Priority::High))->toBe('High')
        ->and(Csv::cell(1.5))->toBe('1.5')
        ->and(Csv::cell(-3))->toBe("'-3")
        ->and(Csv::cell(false))->toBe('0');
});

it('quotes commas, quotes and newlines, and keeps keyed rows in order', function (): void {
    $file = new SplFileObject('php://memory', 'w+');

    Csv::row($file, ['b' => 'a,b', 'a' => 'say "hi"', 'c' => "two\nlines"]);

    $file->rewind();
    $out = '';
    while (! $file->eof()) {
        $out .= $file->fgets();
    }

    expect($out)->toBe("\"a,b\",\"say \"\"hi\"\"\",\"two\nlines\"\n");
});
