import { Dir } from '../constants';

export interface ApiMeleeAttack {
  creatureId: uint;
  time: uint;
  x: index;
  y: index;
  direction: Dir
}