import type { ComponentType } from 'react';
import { dialogDemos } from './demos/dialogs';
import { formDemos } from './demos/forms';
import { pageKitDemos } from './demos/page-kit';
import { setupDemos } from './demos/setup';
import { shellDemos } from './demos/shell';
import { viewDemos } from './demos/views';

export const demos: Record<string, ComponentType> = {
    ...shellDemos,
    ...pageKitDemos,
    ...dialogDemos,
    ...formDemos,
    ...viewDemos,
    ...setupDemos,
};
