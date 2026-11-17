# ServiceStatusList · Company OS

Each service the app needs, configured or missing, with the env names to set. Never a value.

**One job:** Tell an admin what the server still needs without putting a secret anywhere near the browser.
**Category:** organization · **Pieces:** 7, 8 · **Exports:** ServiceStatusList, serviceStatusLabels, ServiceStatus, ServiceStatusLabels · **Tags:** services, env, configuration, workspace, setup, secrets

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/service-status-list.json
```

Manual: copy components/company-os/service-status-list.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

Renders `ServiceStatus::rows()`: `{ key, label, ok, env }` from `config()`. Shown on the workspace page and inside the setup checklist.

The env names tell the person who deploys what to set. The values stay on the server; the UI only ever says ok or missing.

## Examples

### On the workspace page

```tsx
import { ServiceStatusList } from '@/components/company-os';

<ServiceStatusList services={services} action={<Link href={route('organization.setup')}>Open setup</Link>} />
```

## Props

### ServiceStatusList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `services` | `ServiceStatus[]` | — | `{ key, label, ok, env: string[] }`. |
| `action` | `ReactNode` | — | Top-right of the card, e.g. a link to setup. |
| `labels` | `Partial<ServiceStatusLabels>` | — | Title, ok and missing words. |

## Accessibility

- State is a word next to an icon, never colour alone.

## Don't

- No secret values, masked or not.
- No form to type a key. Secrets live in env; if one must be set in the UI it is stored encrypted and only key_changed is logged.

## FAQ

**Why read config() and not env()?**

Config caching makes env() null in production. ServiceStatus reads config().
