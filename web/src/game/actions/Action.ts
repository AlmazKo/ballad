import { Creature } from '../Creature';
import { tsm, uint } from '../../types';

export interface Action {
  readonly id: uint,
  readonly source: Creature,
  readonly time: tsm,

}