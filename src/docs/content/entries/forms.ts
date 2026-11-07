import type { DocEntry } from '../types';
import { passwordInput } from './password-input';
import { phoneField } from './phone-field';
import { remoteCombobox } from './remote-combobox';
import { verifyPhoneDialog } from './verify-phone-dialog';

export const forms: DocEntry[] = [phoneField, passwordInput, remoteCombobox, verifyPhoneDialog];
