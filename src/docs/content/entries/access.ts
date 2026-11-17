import type { DocEntry } from '../types';
import { permissionPicker } from './permission-picker';
import { preferenceMatrix } from './preference-matrix';
import { sensitiveSwitches } from './sensitive-switches';

export const access: DocEntry[] = [permissionPicker, sensitiveSwitches, preferenceMatrix];
