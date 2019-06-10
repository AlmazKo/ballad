import { Focus } from './Moving';

export interface MovingListener {
  onStartMoving(f: Focus): void;

  // onChangeSight(dir: Dir): void;
  onStopMoving(): void;

  // onAction(f: any): void;
}
