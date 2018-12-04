import { index, int, uint } from '../../types';

export interface ApiDamage {
  victimId: uint;
  time: uint;
  x: index;
  y: index;
  amount: int;
}