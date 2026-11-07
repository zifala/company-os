import type { DocEntry } from '../types';
import { appHeader } from './app-header';
import { appShell } from './app-shell';
import { appSidebar } from './app-sidebar';
import { appTour } from './app-tour';
import { commandPalette } from './command-palette';
import { localeSwitch } from './locale-switch';
import { nav } from './nav';
import { notificationBell } from './notification-bell';
import { quickCreate } from './quick-create';
import { sectionLayout } from './section-layout';
import { shortcutHelp } from './shortcut-help';

export const shell: DocEntry[] = [
    appShell,
    appSidebar,
    nav,
    appHeader,
    quickCreate,
    commandPalette,
    shortcutHelp,
    notificationBell,
    localeSwitch,
    sectionLayout,
    appTour,
];
