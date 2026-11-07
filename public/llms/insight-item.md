# InsightItem · Company OS

One insight: severity, title, body, folded evidence, suggestions you can apply, mark seen, dismiss.

**One job:** Present one rule signal and let the reader act on it or close it.
**Category:** setup · **Pieces:** 24, 11 · **Exports:** InsightItem, Insight, InsightLabels · **Tags:** insight, signal, inbox, suggestion, evidence

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/insight-item.json
```

Manual: copy components/company-os/insight-item.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: pill.
shadcn primitives: button, collapsible.

## Overview

A rule raises at most one live insight per kind and scope. The item shows its severity pill, the agent and kind, the title and body, a folded list of evidence lines with links to the records, and the suggestions, each with an Apply button that runs the normal Action. "Mark seen" acknowledges; "Dismiss" opens a ReasonDialog on the page and keeps the rule quiet for seven days.

## Examples

### In the inbox

```tsx
import { InsightItem } from '@/components/company-os';

<InsightItem
  insight={insight}
  pending={pending}
  onApply={(index) => router.post(insights.apply(insight.id).url, { index })}
  onAcknowledge={() => router.post(insights.acknowledge(insight.id).url)}
  onDismiss={() => setDismissing(insight)}
/>
```

## Props

### InsightItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `insight` | `Insight` | — | Severity, status, evidence and suggestions as the server sends them. |
| `evidenceOpen` | `boolean` | `false` | Start with the evidence unfolded. |
| `pending` | `number | null` | — | Index of the suggestion being applied. |
| `onApply · onAcknowledge · onDismiss` | `functions` | — | The page's requests; dismiss opens the reason dialog. |
| `labels` | `InsightLabels` | — | evidence, written, applied, applying, markSeen, dismiss. |

## Accessibility

- Evidence is a native collapsible with an expanded state; suggestions are a list with one button each.

## Don't

- No insight text stored translated; the server renders it for the reader's locale.
- No apply without the suggestion's normal Action and audit.
- No dismiss without a reason.

## FAQ

**Where do insights come from?**

Rule signals on a schedule. The agent layer may word them; the numbers are always cited.
