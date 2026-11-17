<?php

declare(strict_types=1);

use CompanyOs\Audit\AuditEvents;
use CompanyOs\Tests\Fixtures\Activity;
use Illuminate\Support\Facades\DB;
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

it('takes the whole name as the prefix when there is no dot', function (): void {
    expect(AuditEvents::prefix('login'))->toBe('login')
        ->and(AuditEvents::prefix('client.contact.added'))->toBe('client');
});

it('sorts prefixes as strings, numeric ones included', function (): void {
    expect(AuditEvents::prefixes(['10.x', '9.x', 'b.x', 'a.x', 'a.y']))->toBe(['10', '9', 'a', 'b'])
        ->and(AuditEvents::prefixes([]))->toBe([]);
});

it('filters events by prefix on any driver, wildcards literal', function (): void {
    foreach (['client.deleted', 'client.restored', 'clients_x.deleted', 'clientsAx.deleted', 'invoice.sent'] as $event) {
        Activity::query()->create(['event' => $event]);
    }

    $events = fn (string $prefix): array => AuditEvents::wherePrefix(Activity::query(), $prefix)->orderBy('event')->pluck('event')->all();

    expect($events('client'))->toBe(['client.deleted', 'client.restored', 'clientsAx.deleted', 'clients_x.deleted'])
        ->and($events('clients_'))->toBe(['clients_x.deleted'])
        ->and($events('%'))->toBe([])
        ->and(AuditEvents::wherePrefix(DB::table('activity_log'), 'invoice', 'activity_log.event')->pluck('event')->all())->toBe(['invoice.sent']);
});
