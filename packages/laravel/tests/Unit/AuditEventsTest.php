<?php

declare(strict_types=1);

use CompanyOs\Audit\AuditEvents;
use Illuminate\Support\Facades\Lang;

it('labels a known event from lang in en and so and falls back to the raw name', function (): void {
    Lang::addLines(['audit.events.client.deleted' => 'Client deleted'], 'en');
    Lang::addLines(['audit.events.client.deleted' => 'Macmiil waa la tirtiray'], 'so');

    expect(AuditEvents::label('client.deleted'))->toBe('Client deleted');

    app()->setLocale('so');
    expect(AuditEvents::label('client.deleted'))->toBe('Macmiil waa la tirtiray')
        ->and(AuditEvents::label('client.merged'))->toBe('client.merged');
});

it('derives sorted distinct prefixes before the first dot', function (): void {
    expect(AuditEvents::prefixes(['invoice.sent', 'client.deleted', 'client.restored', 'trash.purged']))
        ->toBe(['client', 'invoice', 'trash']);
});

it('escapes wildcards in the prefix filter', function (): void {
    expect(AuditEvents::likePrefix('a_b%'))->toBe('a\_b\%%');
});
