# LocaleSwitch · Company OS

A globe with the current language code. Pick another and the page reloads in it.

**One job:** Switch the interface language in one click from any page.
**Category:** shell · **Pieces:** 18 · **Exports:** LocaleSwitch, LocaleOption · **Tags:** locale, language, bilingual, i18n, switch

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/locale-switch.json
```

Manual: copy components/company-os/locale-switch.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, dropdown-menu.

## Overview

A ghost button showing the current code in uppercase, a dropdown listing each locale by its own name with a check on the active one. `onChange(value)` is the page's: post the locale route, store it on the user, reload. The component holds no state.

Bilingual from day one. Two locales in the header is the normal case; the list is data so a third costs nothing.

## Examples

### English and Somali

```tsx
import { LocaleSwitch } from '@/components/company-os';

<LocaleSwitch
  locales={[{ value: 'en', label: 'English' }, { value: 'so', label: 'Soomaali' }]}
  current={locale}
  onChange={(value) => router.post(localeRoute.update(), { locale: value }, { preserveScroll: true })}
/>
```

## Props

### LocaleSwitch

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `locales` | `LocaleOption[]` | — | `{ value, label }`. Label in that language. |
| `current` | `string` | — | Active locale code. |
| `onChange` | `(value: string) => void` | — | The page persists and reloads. |
| `label` | `string` | `'Language'` | `aria-label` of the button. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter / Space | Open the list. |
| ↑ ↓ Enter | Pick a language. |

- The button names itself "Language" plus the visible code; each option is its language name in that language.
- The active option carries a check icon; the label is the information.

## Don't

- No flags. A language is not a country.
- No locale stored only in the browser. The user row keeps it so mail and the app agree.
- No native `<select>`.

## FAQ

**Where does the translated copy come from?**

`lang/en` and `lang/so` on the server, shared to the page. Components take copy as props.
