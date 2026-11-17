import type { DocEntry } from '../types';
import { insightItem } from './insight-item';
import { onboardingCard } from './onboarding-card';
import { onboardingStepper } from './onboarding-stepper';
import { reviewProblems } from './review-problems';
import { setupChecklist } from './setup-checklist';

export const setup: DocEntry[] = [setupChecklist, onboardingCard, onboardingStepper, reviewProblems, insightItem];
