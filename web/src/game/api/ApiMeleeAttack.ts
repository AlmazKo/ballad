import { Dir } from '../../game2/render/constants';

export interface ApiMeleeAttack {
  creatureId: uint;
  time: uint;
  x: index;
  y: index;
  direction: Dir
}
