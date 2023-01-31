import { createInjectorFor } from '@elementor/locations';
import { LOCATION_CANVAS_DISPLAY, LOCATION_PRIMARY_ACTION } from './consts';
import { createRegisterMenuItemFor } from './register-menu-item';
import Link from '../components/actions/link';
import Action from '../components/actions/action';
import ToggleAction from '../components/actions/toggle-action';

export * from './consts';

export const injectIntoCanvasDisplay = createInjectorFor( LOCATION_CANVAS_DISPLAY );
export const injectIntoPrimaryAction = createInjectorFor( LOCATION_PRIMARY_ACTION );
export const registerLink = createRegisterMenuItemFor( Link );
export const registerAction = createRegisterMenuItemFor( Action );
export const registerToggleAction = createRegisterMenuItemFor( ToggleAction );
