# SensitiveSwitches · Company OS

One switch per sensitive field family, each with the line that says what it reveals.

**One job:** Hide money, margins, salaries and client contacts per role without a permission per field.
**Category:** access · **Pieces:** 5 · **Exports:** SensitiveSwitches, SensitiveSwitch · **Tags:** sensitive, switches, roles, money, salaries, access

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/sensitive-switches.json
```

Manual: copy components/company-os/sensitive-switches.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: switch.

## Overview

Sits under the PermissionPicker on the role form. The switches mirror `app/Enums/Sensitive.php`: money, cost and margin, salaries, client contacts. Off means the server strips the fields before they reach the page.

Same rule as the picker: a switch the editor does not see themselves cannot be turned on, only off.

## Examples

### Under the role form

```tsx
import { SensitiveSwitches } from '@/components/company-os';

<SensitiveSwitches
  switches={switches}
  value={form.data.sensitive}
  onChange={(sensitive) => form.setData('sensitive', sensitive)}
  holds={(key) => auth.sensitive.includes(key)}
/>
```

## Props

### SensitiveSwitches

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `switches` | `SensitiveSwitch[]` | — | `{ key, label, hint }`. |
| `value · onChange` | `string[]` | — | Keys that are on. |
| `holds` | `(key: string) => boolean` | — | Whether the editor sees this family. |
| `title` | `string` | `'Sensitive fields'` | Card title. |
| `disabled` | `boolean` | `false` | Locks every switch. |

## Accessibility

- Each switch is labelled by its name and described by its hint.

## Don't

- No hiding a field in React alone. The presenter drops it on the server.
- No switch per column. Families, from the enum.

## FAQ

**Why not a permission?**

A switch cuts across modules: money shows on deals, invoices and payments. One switch, every presenter reads it through Access::sees.
