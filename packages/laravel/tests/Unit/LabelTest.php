<?php

declare(strict_types=1);

use CompanyOs\Support\Label;
use Illuminate\Support\Facades\Lang;

it('returns the first key that exists, with replacements', function (): void {
    Lang::addLines(['app.second' => 'Second :n'], 'en');

    expect(Label::first(['app.first', 'app.second', 'company-os::trash.empty'], ['n' => 2]))->toBe('Second 2')
        ->and(Label::first(['company-os::trash.empty'], ['days' => 30]))->toBe('Nothing here. Deleted records stay in the trash for 30 days.');
});

it('falls back to the last key, or the default when given', function (): void {
    expect(Label::first(['app.none', 'app.missing']))->toBe('app.missing')
        ->and(Label::first(['app.none'], [], 'Fallback'))->toBe('Fallback')
        ->and(Label::first([]))->toBe('');
});

it('prefers the app key over the package key, under a configurable prefix', function (): void {
    expect(Label::appOrPackage('trash', 'trash', 'parent_in_trash'))->toBe('Restore the record this belongs to first.');

    Lang::addLines(['records.parent_in_trash' => 'Restore the folder first.'], 'en');
    config(['company-os.lang.trash' => 'records']);

    expect(Label::appOrPackage('trash', 'trash', 'parent_in_trash'))->toBe('Restore the folder first.')
        ->and(Label::appOrPackage('trash', 'trash', 'unknown'))->toBe('unknown');
});

it('reads app-only labels under a configurable prefix and falls back to the raw key', function (): void {
    Lang::addLines(['palette.groups.clients' => 'Clients'], 'en');
    config(['company-os.lang.search_groups' => 'palette.groups']);

    expect(Label::app('search_groups', 'search.groups', 'clients'))->toBe('Clients')
        ->and(Label::app('search_groups', 'search.groups', 'notes'))->toBe('notes');
});
