import type { DocEntry } from '../types';
import { auditLogTable } from './audit-log-table';
import { calendarFeedCard } from './calendar-feed-card';
import { grantList } from './grant-list';
import { letterheadPreview } from './letterhead-preview';
import { secretReveal } from './secret-reveal';
import { serviceStatusList } from './service-status-list';
import { webhookDeliveryLog } from './webhook-delivery-log';
import { webhookEndpointStatus } from './webhook-endpoint-status';
import { webhookEventPicker } from './webhook-event-picker';

export const organization: DocEntry[] = [
    auditLogTable,
    serviceStatusList,
    letterheadPreview,
    webhookEventPicker,
    webhookDeliveryLog,
    webhookEndpointStatus,
    secretReveal,
    grantList,
    calendarFeedCard,
];
