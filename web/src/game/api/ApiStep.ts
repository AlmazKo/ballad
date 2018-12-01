import { index, ms, uint } from '../../types';
import { Dir } from '../types';

export interface ApiStep {
  creatureId: uint;
  time: uint;
  fromX: index;
  fromY: index;
  direction: Dir;
  duration: ms;
}