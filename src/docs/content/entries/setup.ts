import type { DocEntry } from '../types';
import { insightItem } from './insight-item';
import { onboardingCard } from './onboarding-card';
import { setupChecklist } from './setup-checklist';

export const setup: DocEntry[] = [setupChecklist, onboardingCard, insightItem];
