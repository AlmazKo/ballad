import { Dir } from '../../game2/constants';

export interface ApiStep {
  creatureId: uint;
  time: uint;
  fromX: index;
  fromY: index;
  direction: Dir;
  duration: ms;
}
