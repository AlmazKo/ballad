import { index, int, uint } from '../../types';

export interface ApiDamage {
  victimId: uint;
  time: uint;
  X: index;
  Y: index;
  amount: int;
}