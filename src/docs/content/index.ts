import { dialogs } from './entries/dialogs';
import { forms } from './entries/forms';
import { pageKit } from './entries/page-kit';
import { setup } from './entries/setup';
import { shell } from './entries/shell';
import { views } from './entries/views';
import type { DocEntry } from './types';

export { categories } from './categories';
export type { DocEntry } from './types';

export const entries: DocEntry[] = [...shell, ...pageKit, ...dialogs, ...forms, ...views, ...setup];

export const entryBySlug = (slug: string) => entries.find((entry) => entry.slug === slug);
