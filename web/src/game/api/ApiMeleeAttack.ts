import { Dir } from '../../game2/constants';

export interface ApiMeleeAttack {
  creatureId: uint;
  time: uint;
  x: index;
  y: index;
  direction: Dir
}
