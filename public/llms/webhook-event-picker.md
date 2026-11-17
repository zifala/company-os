# WebhookEventPicker · Company OS

The event catalogue as checkboxes, grouped by noun, with a tri-state box per group and the raw name under each label.

**One job:** Subscribe an endpoint to exactly the catalogue events it needs.
**Category:** organization · **Pieces:** 22, 3 · **Exports:** WebhookEventPicker, webhookEventPickerLabels, WebhookEvent, WebhookEventGroup, WebhookEventPickerLabels · **Tags:** webhooks, events, catalogue, subscribe, checkbox

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/webhook-event-picker.json
```

Manual: copy components/company-os/webhook-event-picker.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: checkbox.

## Overview

Groups come from `WebhookEvents::all()`, split on the prefix before the first dot. The raw name is shown because that is what the receiver switches on.

The store request validates each name with `Rule::in(WebhookEvents::all())` and needs at least one.

## Examples

### In the create dialog

```tsx
import { WebhookEventPicker } from '@/components/company-os';

<WebhookEventPicker groups={catalogue} value={form.data.events} onChange={(events) => form.setData('events', events)} />
```

## Props

### WebhookEventPicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` | `WebhookEventGroup[]` | — | `{ key, label, events: { name, label }[] }`. |
| `value · onChange` | `string[]` | — | Selected event names. |
| `disabled` | `boolean` | `false` | Locks every box. |
| `labels` | `Partial<WebhookEventPickerLabels>` | — | Group toggle name and the count. |

## Accessibility

| Keys | Action |
| --- | --- |
| Space | Toggle the focused event or group |

- Each group is a fieldset; the group box reports mixed when some events are on.

## Don't

- No wildcard subscription. New events are opted into, so a receiver never gets a shape it has not seen.
- No free-text event names.

## FAQ

**Where is webhook.test?**

Not in the catalogue. Send test always uses it, whatever the endpoint subscribes to.
