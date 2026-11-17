# WebhookDeliveryLog · Company OS

Every delivery as a row: event, status, attempts, response code over its excerpt, next attempt, resend.

**One job:** Answer "did they get it, and if not why" from the endpoint page.
**Category:** organization · **Pieces:** 22 · **Exports:** WebhookDeliveryLog, webhookDeliveryLogLabels, WebhookDelivery, WebhookDeliveryLogLabels · **Tags:** webhooks, deliveries, retry, resend, log

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/webhook-delivery-log.json
```

Manual: copy components/company-os/webhook-delivery-log.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: cells, data-table.
shadcn primitives: table, button.

## Overview

Rows are `webhook_deliveries`, 25 per page. Status is the `WebhookDeliveryStatus` label and tone: Pending, Retrying, Delivered, Failed. The excerpt is the first 500 characters the receiver answered, or why nothing was sent.

Resend copies the payload into a new delivery row; the old row stays. The column disappears when the endpoint is off or the viewer lacks `integrations.manage`.

## Examples

### On the endpoint page

```tsx
import { WebhookDeliveryLog } from '@/components/company-os';

<WebhookDeliveryLog
  page={deliveries}
  deliveries={deliveries.data}
  canResend={endpoint.active && can.manage}
  resending={resendingId}
  onResend={(delivery) => router.post(route('organization.integrations.webhooks.deliveries.resend', delivery.id))}
/>
```

## Props

### WebhookDeliveryLog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `Paginated<unknown>` | — | The paginator. |
| `deliveries` | `WebhookDelivery[]` | — | `{ id, event, status, attempts, responseCode, excerpt, createdAt, nextAttemptAt }`. |
| `canResend` | `boolean` | — | Shows the resend column. |
| `resending` | `string | null` | `null` | Delivery id in flight; its button disables. |
| `onResend` | `(delivery) => void` | — | Called with the row. |
| `labels` | `Partial<WebhookDeliveryLogLabels>` | — | Column heads, resend, empty copy. |

## Accessibility

- Each resend button names its event.
- The full excerpt is the title of the truncated line.

## Don't

- No payload body in the table. It can hold personal data; open the delivery for it if you must.
- No retry button that skips the schedule. Resend makes a new row.

## FAQ

**Why does a failed row have no next attempt?**

Eight attempts, or three days failing, and the schedule stops. The endpoint then turns itself off.
