import { index, uint } from '../../types';

export interface ApiDeath {
  victimId: uint;
  time: uint;
  X: index;
  Y: index;
}