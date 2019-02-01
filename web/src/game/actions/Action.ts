import { Creature } from '../../game2/engine/Creature';

export interface Action {
  readonly id: uint,
  readonly creature: Creature,
  readonly time: tsm,

}
