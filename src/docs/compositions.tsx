import type { ComponentType } from 'react';
import { FormPage } from '@/blocks/form-page';
import { HomeDashboard } from '@/blocks/home-dashboard';
import { IndexPage } from '@/blocks/index-page';
import { OnboardingReview } from '@/blocks/onboarding-review';
import { RecordPage } from '@/blocks/record-page';
import { RolesIndex } from '@/blocks/roles-index';
import { AuditLogPage } from '@/templates/audit-log-page';
import { WorkspacePage } from '@/templates/workspace-page';
import { WebhooksPage } from '@/templates/webhooks-page';
import { WebhookEndpointPage } from '@/templates/webhook-endpoint-page';
import { GrantsPage } from '@/templates/grants-page';
import { GuestOnboarding } from '@/templates/guest-onboarding';
import { NotificationSettings } from '@/templates/notification-settings';
import { NotificationsPage } from '@/templates/notifications-page';
import { OnboardingStepperPage } from '@/templates/onboarding-stepper';
import { PrintInvoice } from '@/templates/print-invoice';
import { RolesPage } from '@/templates/roles-page';
import { SettingsPage } from '@/templates/settings-page';
import { SetupPage } from '@/templates/setup-page';
import { TrashPage } from '@/templates/trash-page';
import { UsersPage } from '@/templates/users-page';
import formPageSrc from '@/blocks/form-page.tsx?raw';
import homeDashboardSrc from '@/blocks/home-dashboard.tsx?raw';
import indexPageSrc from '@/blocks/index-page.tsx?raw';
import onboardingReviewSrc from '@/blocks/onboarding-review.tsx?raw';
import recordPageSrc from '@/blocks/record-page.tsx?raw';
import rolesIndexSrc from '@/blocks/roles-index.tsx?raw';
import auditLogPageSrc from '@/templates/audit-log-page.tsx?raw';
import workspacePageSrc from '@/templates/workspace-page.tsx?raw';
import webhooksPageSrc from '@/templates/webhooks-page.tsx?raw';
import webhookEndpointPageSrc from '@/templates/webhook-endpoint-page.tsx?raw';
import grantsPageSrc from '@/templates/grants-page.tsx?raw';
import guestOnboardingSrc from '@/templates/guest-onboarding.tsx?raw';
import notificationSettingsSrc from '@/templates/notification-settings.tsx?raw';
import notificationsPageSrc from '@/templates/notifications-page.tsx?raw';
import onboardingStepperSrc from '@/templates/onboarding-stepper.tsx?raw';
import printInvoiceSrc from '@/templates/print-invoice.tsx?raw';
import rolesPageSrc from '@/templates/roles-page.tsx?raw';
import settingsPageSrc from '@/templates/settings-page.tsx?raw';
import setupPageSrc from '@/templates/setup-page.tsx?raw';
import trashPageSrc from '@/templates/trash-page.tsx?raw';
import usersPageSrc from '@/templates/users-page.tsx?raw';

export type CompositionRender = { Component: ComponentType; source: string };

export const compositionRender: Record<string, CompositionRender> = {
    'index-page': { Component: IndexPage, source: indexPageSrc },
    'record-page': { Component: RecordPage, source: recordPageSrc },
    'form-page': { Component: FormPage, source: formPageSrc },
    'home-dashboard': { Component: HomeDashboard, source: homeDashboardSrc },
    'roles-index': { Component: RolesIndex, source: rolesIndexSrc },
    'onboarding-review': { Component: OnboardingReview, source: onboardingReviewSrc },
    'users-page': { Component: UsersPage, source: usersPageSrc },
    'trash-page': { Component: TrashPage, source: trashPageSrc },
    'setup-page': { Component: SetupPage, source: setupPageSrc },
    'settings-page': { Component: SettingsPage, source: settingsPageSrc },
    'roles-page': { Component: RolesPage, source: rolesPageSrc },
    'audit-log-page': { Component: AuditLogPage, source: auditLogPageSrc },
    'workspace-page': { Component: WorkspacePage, source: workspacePageSrc },
    'webhooks-page': { Component: WebhooksPage, source: webhooksPageSrc },
    'webhook-endpoint-page': { Component: WebhookEndpointPage, source: webhookEndpointPageSrc },
    'grants-page': { Component: GrantsPage, source: grantsPageSrc },
    'notifications-page': { Component: NotificationsPage, source: notificationsPageSrc },
    'notification-settings': { Component: NotificationSettings, source: notificationSettingsSrc },
    'onboarding-stepper': { Component: OnboardingStepperPage, source: onboardingStepperSrc },
    'guest-onboarding': { Component: GuestOnboarding, source: guestOnboardingSrc },
    'print-invoice': { Component: PrintInvoice, source: printInvoiceSrc },
};
