import { index, uint } from '../../types';
import { Dir } from '../types';

export interface ApiMeleeAttack {
  creatureId: uint;
  time: uint;
  x: index;
  y: index;
  direction: Dir
}