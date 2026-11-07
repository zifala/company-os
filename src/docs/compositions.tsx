import type { ComponentType } from 'react';
import { FormPage } from '@/blocks/form-page';
import { HomeDashboard } from '@/blocks/home-dashboard';
import { IndexPage } from '@/blocks/index-page';
import { RecordPage } from '@/blocks/record-page';
import { SettingsPage } from '@/templates/settings-page';
import { SetupPage } from '@/templates/setup-page';
import { TrashPage } from '@/templates/trash-page';
import { UsersPage } from '@/templates/users-page';
import formPageSrc from '@/blocks/form-page.tsx?raw';
import homeDashboardSrc from '@/blocks/home-dashboard.tsx?raw';
import indexPageSrc from '@/blocks/index-page.tsx?raw';
import recordPageSrc from '@/blocks/record-page.tsx?raw';
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
    'users-page': { Component: UsersPage, source: usersPageSrc },
    'trash-page': { Component: TrashPage, source: trashPageSrc },
    'setup-page': { Component: SetupPage, source: setupPageSrc },
    'settings-page': { Component: SettingsPage, source: settingsPageSrc },
};
