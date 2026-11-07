import type { DocEntry } from '../types';
import { csvImport } from './csv-import';
import { exportButton } from './export-button';
import { favoriteButton } from './favorite-button';
import { savedViewsMenu } from './saved-views-menu';

export const views: DocEntry[] = [savedViewsMenu, favoriteButton, exportButton, csvImport];
