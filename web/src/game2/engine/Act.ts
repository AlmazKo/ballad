import { Creature } from './Creature';

export interface Act {
  readonly id: uint,
  readonly creature: Creature,
  readonly startTime: tsm,
}
