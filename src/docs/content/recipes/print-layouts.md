# Print layouts

Rule: every official document has its own print route that renders a server-side A4 page — letterhead, repeating header and footer, page numbers — and the browser's print dialog makes the PDF. No PDF package until a real need (email attachment, archive) proves one.

Shape:
- Official document = a record someone outside the app receives or signs: `<Model>` with a number, an issue date, and a final state.
- Route: `GET /<models>/{<model>}/print`, name `<models>.print`, behind the record's `view` policy and its `visibleTo` scope.
- `app/Http/Controllers/Print<Model>Controller.php` — invokable: authorize, load relations, return the view. Nothing else.
- `app/Http/Requests/Print<Model>Request.php` — `locale` nullable, `Rule::enum(Locale::class)`.
- `resources/views/print/layout.blade.php` — the one print shell: `@page`, letterhead, repeating header / footer, page counter, screen toolbar.
- `resources/views/print/<model>.blade.php` — `@extends('print.layout')`, document body only.
- Letterhead from `WorkspaceSetting::current()` (legal name, address, registration number, logo from medialibrary). Nothing hardcoded.
- React: "Print" item in the record's `ActionsMenu` → `<a href={<models>.print(id).url} target="_blank" rel="noopener">`. Hidden by the server `can.view` flag like every action.
- Optional `?locale=en|so` prints in the other language for this response only.

Code:

```php
final class Print<Model>Controller extends Controller
{
    public function __invoke(Print<Model>Request $request, <Model> $<model>): View
    {
        $this->authorize('view', $<model>);

        if ($request->validated('locale')) {
            App::setLocale($request->validated('locale'));
        }

        return view('print.<model>', [
            '<model>' => $<model>->load('lines', 'creator'),
            'workspace' => WorkspaceSetting::current(),
            'viewer' => $request->user(),
        ]);
    }
}
```

```blade
<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title>@yield('title')</title>
    <style>
        @page { size: A4; margin: 18mm 16mm 20mm; @bottom-right { content: "{{ __('print.page') }} " counter(page) " / " counter(pages); font-size: 9pt; } }
        body { font: 10.5pt/1.45 system-ui, sans-serif; color: #111; margin: 0; }
        .sheet { max-width: 178mm; margin: 0 auto; }
        table.frame { width: 100%; border-collapse: collapse; }
        thead.running { display: table-header-group; }
        tfoot.running { display: table-footer-group; }
        .lines td, .lines th { border-bottom: 0.5pt solid #ccc; padding: 2mm 1mm; }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .keep { break-inside: avoid; }
        .stamp { position: fixed; top: 40%; width: 100%; text-align: center; font-size: 64pt; opacity: .08; transform: rotate(-20deg); }
        @media screen { body { background: #eee; } .sheet { background: #fff; padding: 18mm 16mm; margin: 8mm auto; } }
        @media print { .toolbar { display: none; } }
    </style>
</head>
<body>
    <div class="toolbar"><button onclick="window.print()">{{ __('print.print') }}</button></div>
    @isset($stamp)<div class="stamp">{{ $stamp }}</div>@endisset
    <div class="sheet">
        <table class="frame">
            <thead class="running"><tr><td>@include('print.letterhead')</td></tr></thead>
            <tfoot class="running"><tr><td>@include('print.footer')</td></tr></tfoot>
            <tbody><tr><td>@yield('body')</td></tr></tbody>
        </table>
    </div>
</body>
</html>
```

```blade
@extends('print.layout', ['stamp' => $<model>->status->printStamp()])
@section('title', __('<module>.print_title', ['number' => $<model>->number]))
@section('body')
    <h1>{{ __('<module>.document_name') }} {{ $<model>->number }}</h1>
    <p>{{ __('<module>.issued_on') }}: {{ $<model>->issued_on->translatedFormat('j F Y') }}</p>
    <table class="lines">
        @foreach ($<model>->lines as $line)
            <tr class="keep"><td>{{ $line->description }}</td><td class="num">{{ Number::currency($line->amount, $<model>->currency, app()->getLocale()) }}</td></tr>
        @endforeach
    </table>
@endsection
```

- `<Model>Status::printStamp(): ?string` — `__('print.stamp.draft')` for draft, `__('print.stamp.void')` for voided, `null` when final.
- Footer: legal name, registration number, contact line, printed-at in viewer timezone (`UserTime`), document number.
- Totals block, signature block, and bank details each `class="keep"` so they never split across pages.
- Raw colours here are allowed: print is ink on paper, outside the app theme. Black text, grey hairlines, no brand fills.

Test:
- Viewer with `view` gets 200 and `text/html`; the document number and every line appear.
- Without `view` → 403; outside `visibleTo` scope → 404.
- `?locale=so` renders Somali labels; invalid locale → 422; the user's saved locale is unchanged afterwards.
- Draft prints the draft stamp; final prints none.
- Letterhead comes from workspace settings: change the legal name, see it on the page.
- Amounts use `Number::currency` in the active locale (assert one formatted total).

Gotchas:
- Blade, not an Inertia page: no JS bundle, no shell, prints instantly, same HTML a PDF package would take later.
- `thead` / `tfoot` with `table-header-group` / `table-footer-group` repeat on every printed page in all browsers. `@page` margin boxes (page x / y) work in Chromium; other browsers print without numbers. Say "print from Chrome or Edge" in the help text.
- Set `@page { size: A4 }` and test with the browser's "Default margins". Users who pick "None" lose the footer.
- Formatting, labels, stamps, totals: all PHP. The view only prints strings.
- Translatable content (`spatie/laravel-translatable`) follows the forced locale automatically.
- Images: medialibrary conversion URL, absolute. A signed temporary URL expires before a slow print finishes; use a conversion on the public disk for the logo only.
- Need a stored PDF (email attachment, archive)? Then add one renderer (e.g. headless Chromium) that takes this same view. Never a second layout.
- Printing is a read. No audit row, no state change. "Issue" / "send" are separate Actions.

Harvested: 2026-10-08 (all from standard; source has no print routes or print styles)
