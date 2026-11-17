# GrantList · Company OS

The pages granted to one person on top of their role: what, who granted it, when, and revoke with a reason.

**One job:** Add or take away a single page for one person without inventing a role for them.
**Category:** organization · **Pieces:** 5, 16 · **Exports:** GrantList, grantListLabels, Grant, GrantListLabels · **Tags:** grants, delegated, pages, revoke, scoped permissions, access

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/grant-list.json
```

Manual: copy components/company-os/grant-list.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: cells, data-table, reason-dialog.
shadcn primitives: table, button.

## Overview

Rows are the `grants` table for one user: `page`, `granted_by`, `granted_at`, `revoked_at`. Revoked rows stay, struck through, with who and why — grants are stamped, never erased.

Revoke opens a ReasonDialog. It shows only where `canRevoke` is true: the recipe lets a person grant and revoke only pages they hold. Granting is a FormDialog on the page whose options are those same pages.

## Examples

### On the user's Grants tab

```tsx
import { GrantList } from '@/components/company-os';

<GrantList
  person={user.name}
  grants={grants}
  canRevoke={(grant) => auth.pages.includes(grant.page.key)}
  processing={form.processing}
  errors={form.errors}
  onRevoke={(grant, reason, done) => router.delete(route('organization.users.grants.destroy', [user.id, grant.id]), { data: { reason }, onSuccess: done })}
/>
```

### No grants

```tsx
<GrantList person="Mahad Yusuf" grants={[]} canRevoke={() => false} onRevoke={() => undefined} />
```

## Props

### GrantList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `person` | `string` | — | Named in the revoke consequence. |
| `grants` | `Grant[]` | — | `{ id, page: { key, label, detail }, grantedBy, grantedAt, revokedAt, revokedBy?, revokeReason? }`. |
| `canRevoke` | `(grant) => boolean` | — | Whether the viewer holds the page. |
| `processing · errors` | `boolean · { reason? }` | — | Request state for the dialog. |
| `onRevoke` | `(grant, reason, done) => void` | — | Call `done` on success to close the dialog. |
| `labels` | `Partial<GrantListLabels>` | — | Column heads, states, dialog copy. |

## Accessibility

- Revoked state is a word in a pill plus the strike-through, never colour alone.

## Don't

- No granting a page you do not hold.
- No deleting grant rows. Revoke stamps revoked_at.
- No grant to work around a missing scope. Fix the role.

## FAQ

**What does a grant give?**

One page in the sidebar and its route. Access::granted checks it; the page still applies the person's scopes and sensitive switches.
