import type { DocEntry } from '../types';
import { actionsMenu } from './actions-menu';
import { activityTimeline } from './activity-timeline';
import { cells } from './cells';
import { dataTable } from './data-table';
import { detailCard } from './detail-card';
import { emptyState } from './empty-state';
import { fieldRow } from './field-row';
import { filterBar } from './filter-bar';
import { formLayout } from './form-layout';
import { listSkeleton } from './list-skeleton';
import { loadError } from './load-error';
import { pageHeader } from './page-header';
import { pill } from './pill';
import { statTile } from './stat-tile';
import { tabNav } from './tab-nav';

export const pageKit: DocEntry[] = [
    pageHeader,
    filterBar,
    dataTable,
    cells,
    pill,
    emptyState,
    tabNav,
    actionsMenu,
    statTile,
    activityTimeline,
    detailCard,
    formLayout,
    fieldRow,
    listSkeleton,
    loadError,
];
