# PermissionPicker · Company OS

Permissions grouped by module, a scope beside each scoped one, and a lock on what the editor does not hold.

**One job:** Build a role in the UI without letting anyone grant beyond their own reach.
**Category:** access · **Pieces:** 4, 5 · **Exports:** PermissionPicker, permissionPickerLabels, PermissionGrant, PermissionGroup, PermissionOption, PermissionPickerLabels, ScopeOption · **Tags:** permissions, roles, scope, access, grant, checkbox

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/permission-picker.json
```

Manual: copy components/company-os/permission-picker.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: checkbox, select.

## Overview

Groups come from the permission registry in `config/permissions.php`, labels from lang. Each group card has a select-all checkbox that turns indeterminate on a partial pick and a count. A permission marked `scoped` shows its scope select once ticked: firm, department, assigned, own.

`holds(name)` answers whether the editor holds a permission. One they do not hold is locked unless the role already has it, so a partial holder can still rename the role or drop permissions. The server guard (`AccessGuards::grantable`) is the real check; the lock is the honest UI.

## Examples

### Role form

Invoices issue and void are locked: the editor does not hold them.

```tsx
import { PermissionPicker } from '@/components/company-os';
import { useForm } from '@inertiajs/react';

const form = useForm({ name: role.name, permissions: role.permissions });

<PermissionPicker
  groups={groups}
  scopes={scopes}
  value={form.data.permissions}
  onChange={(permissions) => form.setData('permissions', permissions)}
  holds={(name) => auth.permissions.includes(name)}
  disabled={role.is_super_admin}
/>
```

## Props

### PermissionPicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` | `PermissionGroup[]` | — | `{ key, label, permissions: { name, label, scoped? }[] }`, in registry order. |
| `value · onChange` | `PermissionGrant[]` | — | `{ name, scope }`. `scope` is `null` for unscoped permissions. |
| `scopes` | `ScopeOption[]` | — | The scope choices; the first is the default on tick. |
| `holds` | `(name: string) => boolean` | — | Whether the editor holds this permission. |
| `disabled` | `boolean` | `false` | Locks everything. The super admin role. |
| `labels` | `PermissionPickerLabels` | — | selectAll, scope, notHeld, selected(count, total). |

## Accessibility

| Keys | Action |
| --- | --- |
| Space | Toggle the focused permission or group |

- Each checkbox has a real label; the scope select is labelled with the permission name.
- The lock icon carries the reason as its label.

## Don't

- No grant of a permission the editor does not hold.
- No editing the super admin role. It passes everything through Gate::before.
- No hiding sidebar items as access control. The server decides; the picker only builds the role.

## FAQ

**Where do labels come from?**

The registry keys map to lang lines. The page passes them translated; the component prints strings.
