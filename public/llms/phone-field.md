# PhoneField · Company OS

The one phone input: country selector, as-you-type formatting, E.164 out, Somalia first.

**One job:** Collect one valid phone number in international form.
**Category:** forms · **Pieces:** 6, 27 · **Exports:** PhoneField, PhoneInput, isValidPhone, DEFAULT_COUNTRY · **Tags:** phone, input, country, libphonenumber, E.164, form

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/phone-field.json
```

Manual: copy components/company-os/phone-field.tsx, components/company-os/phone-input.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: field-row.
shadcn primitives: command, popover.

## Overview

A searchable country selector and a national-format input in one field. The value that leaves the component is always E.164 (`+252612345678`); pasting an international number switches the country. Default country is Somalia (+252), set once per project.

**PhoneField** wraps it in a FieldRow with a label, the server error, and a client check on blur that says the number is not valid for the chosen country. Laravel validates again. There is no other phone input anywhere in a product, dialogs included.

## Examples

### In a form

```tsx
import { PhoneField } from '@/components/company-os';

<PhoneField id="phone" name="phone" label="Phone" defaultValue={contact.phone} error={errors.phone} />
```

## Props

### PhoneField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id · label` | `string` | — | Field id and persistent label. |
| `name` | `string` | — | Adds a hidden input with the E.164 value for `<Form>` pages. |
| `value · defaultValue · onChange` | `string · string · (value) => void` | — | Controlled or uncontrolled. |
| `error · hint` | `string` | — | Server error wins over the client message. |
| `invalidMessage` | `string` | — | The client message on blur. |

### PhoneInput

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultCountry` | `CountryCode` | `'SO'` | Used when the value has no country. |
| `locale` | `string` | `'en'` | Country names via `Intl.DisplayNames`. |
| `labels` | `PhoneLabels` | — | `country`, `searchCountry`, `noMatch`. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Country button, then the number input. |

- The country button carries the `labels.country` name; the input is `type="tel"` with `autoComplete="tel-national"`.
- `aria-invalid` follows the error state.

## Don't

- No plain text input for a phone anywhere.
- No local-format storage. Store E.164.
- No client-only validation. Laravel checks the number with the same library.

## FAQ

**Verify a phone by code?**

VerifyPhoneDialog: this input disabled, "Send code" beside it, then a six-digit code field.
