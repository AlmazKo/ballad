import { Dir } from '../constants';

export interface ApiStep {
  creatureId: uint;
  time: uint;
  fromX: index;
  fromY: index;
  direction: Dir;
  duration: ms;
}