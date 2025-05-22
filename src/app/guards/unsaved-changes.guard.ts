import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../interfaces/can-deactivate.interface';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component, 
  currentRoute, 
  currentState, 
  nextState
) => {
  return component.canDeactivate ? component.canDeactivate(): true;
};
