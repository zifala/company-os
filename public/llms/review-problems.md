# ReviewProblems · Company OS

One row per section: ready, or the problems the server found, with a Fix that jumps to the step.

**One job:** Show what still blocks a submit or an approve, from the same checks the server runs.
**Category:** setup · **Pieces:** 27 · **Exports:** ReviewProblems, reviewProblemsLabels, ReviewProblemsLabels, ReviewSection · **Tags:** onboarding, review, problems, validation, progress

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/review-problems.json
```

Manual: copy components/company-os/review-problems.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: pill.
shadcn primitives: button.

## Overview

Feed it `OnboardingChecks::problems()` keyed by section. The review step of the stepper shows it with `onFix`; the reviewer's page shows it on the right as progress, without Fix.

## Examples

### Review step

```tsx
import { ReviewProblems } from '@/components/company-os';

<ReviewProblems sections={review.sections} onFix={setStep} />
```

## Props

### ReviewProblems

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sections` | `ReviewSection[]` | — | `{ key, label, problems: string[] }`. |
| `onFix` | `(key: string) => void` | — | Shows a Fix button on sections with problems. |
| `labels` | `ReviewProblemsLabels` | — | ready, problems(count), fix, allReady. |

## Accessibility

- An ordered list; state is a word in a pill, the icon is decoration.

## Don't

- No checks computed in React. The list is the server's.
- No disabling submit on problems the server will report anyway; let the 422 land under the field.

## FAQ
