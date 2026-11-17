# Bilingual

Rule: English and Somali from the first commit — every UI string, enum label, message and mail comes from `lang/en` + `lang/so`; user content that needs two languages lives in one JSON column; the user's locale drives the request, the mail and the formatting.

Shape:
- `php artisan lang:publish` → `lang/en/{auth,pagination,passwords,validation}.php`; copy each to `lang/so/` and translate.
- Own files, same names in both folders: `enums.php`, `audit.php`, `notifications.php`, `<module>.php` (Action messages, flash, row labels), `ui.php` (React copy only).
- `app/Enums/Locale.php` — `En = 'en'`, `So = 'so'`; `nativeName()` (`English`, `Soomaali`), never translated.
- `users.locale` string(2), default `config('app.locale')`, cast to `Locale`. `User implements HasLocalePreference`.
- `app/Http/Middleware/SetLocale.php` — web group, after auth. Guests: `config('app.locale')`.
- `HandleInertiaRequests::share()` — `locale`, `locales`, `translations` (`ui.php` flattened).
- `resources/js/lib/i18n.ts` — `useT()` returns `t(key, replace)`. The only way React reads copy.
- `app/Actions/User/ChangeLocale.php` — personal Settings, audit `user.locale_changed`.
- Translatable content: `spatie/laravel-translatable`, `HasTranslations`, `public array $translatable = [...]`, json columns.
- `resources/views/app.blade.php`: `<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">`.

Code:

```php
public function label(): string
{
    return __("enums.<enum>.{$this->value}");
}
```

```php
public function handle(Request $request, Closure $next): Response
{
    App::setLocale($request->user()?->locale->value ?? config('app.locale'));

    return $next($request);
}
```

```php
public function preferredLocale(): string
{
    return $this->locale->value;
}
```

```php
'locale' => app()->getLocale(),
'locales' => collect(Locale::cases())->map(fn (Locale $locale) => ['value' => $locale->value, 'label' => $locale->nativeName()])->all(),
'translations' => fn () => Arr::dot(trans('ui')),
```

```ts
export function useT() {
    const { translations } = usePage<SharedData>().props;

    return (key: string, replace: Record<string, string | number> = {}): string =>
        Object.entries(replace).reduce(
            (text, [name, value]) => text.replaceAll(`:${name}`, String(value)),
            translations[key] ?? key,
        );
}
```

```php
final class <Model> extends Model
{
    use HasTranslations;

    public array $translatable = ['name', 'description'];
}
```

```php
'name' => ['required', 'array:en,so'],
'name.en' => ['required', 'string', 'max:120'],
'name.so' => ['nullable', 'string', 'max:120'],
```

- Action guard: `ValidationException::withMessages(['status' => __('<module>.already_closed', ['name' => $<model>->name])])`.
- Flash: `Inertia::flash('toast', ['type' => 'success', 'message' => __('<module>.closed')])`.
- Notification / mail text: `__()` inside `toMail()` / `toArray()`. `HasLocalePreference` makes queued sends use the recipient's locale, not the sender's.
- Formatting stays in PHP: `$date->translatedFormat('j F Y')`, `Number::format($n, locale: app()->getLocale())`, `Number::currency($amount, $code, app()->getLocale())`. React gets the string.
- Translatable read: `$<model>->name` = current locale, falls back to `config('app.fallback_locale')`. Edit form gets `$<model>->getTranslations('name')`.
- Sort / search on translatable: `orderBy('name->'.app()->getLocale())`, `whereLike('name->'.app()->getLocale(), …)`.
- Locale switch: dropdown of `locales` in personal Settings → `ChangeLocale` → redirect back; whole page re-renders in the new locale.

Test:
- Key parity: `Arr::dot(require lang_path("en/{$file}"))` keys equal `so` keys, for every file in `lang/en` (dataset of files).
- Every case of every backed enum with `label()` has `enums.*` keys in both locales (no label returns its own key).
- User with `so` gets Somali validation messages and shared `translations`.
- Guest gets `config('app.locale')`.
- Queued notification to a `so` user renders Somali while the sender is `en`.
- Translatable: create with `{en, so}`; `so` empty falls back to `en`; `name.en` missing → 422.
- `ChangeLocale` saves, audits `user.locale_changed` with from / to; invalid locale → 422.

Gotchas:
- Day one. Retro-fitting means hunting literals in Actions, enums, row builders, mail, and React. Add the parity test in the first PR.
- No `_en` / `_so` columns. One json column per translatable field.
- Translate content, not data: names of people, emails, codes, amounts stay single-value.
- `__()` at the moment of rendering, not when storing. Never persist translated text in the DB (insights, notifications store keys + params when the reader may switch locale).
- `ui.php` holds only copy React renders itself (buttons, headings, empty states). Everything Laravel already formats (labels, statuses, dates) arrives as ready props; do not duplicate it in `ui.php`.
- Keep `translations` small; it rides on every Inertia response. Split by module only if it grows past a few hundred keys.
- Pluralisation: `trans_choice('<module>.items', $count)` in PHP; React never plurals.
- Carbon follows `App::setLocale()`; never call `Carbon::setLocale()` by hand.
- Missing key in React shows the key itself, which the parity test catches before users do.

Harvested: 2026-10-08 (all from standard and signature; source has no `lang/` folder and hardcoded English labels)
