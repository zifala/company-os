# WebhookEndpointStatus · Company OS

The banner on an endpoint that is failing or off: since when, who turned it off and why, and Enable.

**One job:** Make the auto-disabled state impossible to miss and one click to undo.
**Category:** organization · **Pieces:** 22, 16 · **Exports:** WebhookEndpointStatus, webhookEndpointStatusLabels, WebhookEndpointState, WebhookEndpointStatusLabels · **Tags:** webhooks, disabled, failing, banner, enable

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/webhook-endpoint-status.json
```

Manual: copy components/company-os/webhook-endpoint-status.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: alert, button.

## Overview

Three states. Healthy renders nothing. Failing (`failing_since` set) warns that retries continue and the endpoint turns off after `DisableAfterFailingDays`. Off shows who did it — a person, or the system — with the stored reason and Enable.

Enable clears `disabled_at` and `failing_since`. Turning off by hand is a ReasonDialog on the page; the system writes its own reason.

## Examples

### Turned off by the system

```tsx
import { WebhookEndpointStatus } from '@/components/company-os';

<WebhookEndpointStatus endpoint={endpoint} canManage={can.manage} processing={enabling} onEnable={enable} />
```

### Failing, still retrying

```tsx
<WebhookEndpointStatus endpoint={{ ...endpoint, active: true, failingSince: '16 Nov 2026' }} canManage onEnable={enable} />
```

## Props

### WebhookEndpointStatus

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `endpoint` | `WebhookEndpointState` | — | `{ active, failingSince, disabledAt, disabledBy, disabledReason }`; dates as formatted strings. |
| `disableAfterDays` | `number` | `3` | From `WebhookEndpoint::DisableAfterFailingDays`. |
| `canManage` | `boolean` | — | Shows Enable. |
| `processing · onEnable` | `boolean · () => void` | — | Request state and the action. |
| `labels` | `Partial<WebhookEndpointStatusLabels>` | — | Titles and lines, functions of the dates. |

## Accessibility

- Rendered as an alert so screen readers announce it on load.

## Don't

- No silent re-enable on the next event. A person turns it back on.
- No toast-only notice. The creator is notified and the banner stays.

## FAQ

**Do events while it was off get delivered later?**

No. Nothing is queued while off; resend specific deliveries if the receiver needs them.
