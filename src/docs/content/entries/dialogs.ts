import type { DocEntry } from '../types';
import { confirmDialog } from './confirm-dialog';
import { formDialog } from './form-dialog';
import { reasonDialog } from './reason-dialog';

export const dialogs: DocEntry[] = [confirmDialog, reasonDialog, formDialog];
