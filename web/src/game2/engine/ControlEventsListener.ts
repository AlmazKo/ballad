import { Focus } from '../controller/KeyboardMoving';

export interface ControlEventsListener {
  onChangedOrientation(f: Focus): void;
  onAction(f: Focus): void;
}
