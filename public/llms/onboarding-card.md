# OnboardingCard · Company OS

The side card on a record born from an onboarding: reference, who started it, who approved it, when, and the source.

**One job:** Show where a relationship record came from.
**Category:** setup · **Pieces:** 27 · **Exports:** OnboardingCard, OnboardingSummary, OnboardingLabels · **Tags:** onboarding, record, provenance, side card

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/onboarding-card.json
```

Manual: copy components/company-os/onboarding-card.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: detail-card.

## Overview

Customers, providers and members are born only from an approved onboarding. Their record page carries this compact DetailCard: the reference links back to the onboarding, the rest states who started it, who approved it, the date and the source. Renders nothing when the record predates onboarding.

## Examples

### On a customer page

```tsx
import { OnboardingCard } from '@/components/company-os';

<OnboardingCard onboarding={customer.onboarding} />
```

## Props

### OnboardingCard

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onboarding` | `OnboardingSummary | null` | — | `{ reference, href, started_by, approved_by, approved_at, source, referrer }`. |
| `labels` | `OnboardingLabels` | — | Card title and the six row labels. |

## Accessibility

- Inherits the DetailCard `<dl>`; the reference is a link.

## Don't

- No edit controls; provenance is history.
- No onboarding card on records that have no onboarding.

## FAQ

**Where is the reason for a send-back?**

On the onboarding page itself, read from the latest activity entry.
