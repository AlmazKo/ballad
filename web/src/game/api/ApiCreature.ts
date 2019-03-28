import { Dir } from '../../game2/constants';
import { Metrics } from '../Metrics';

export interface ApiCreature {
  id: uint;
  metrics: Metrics;
  isPlayer: boolean,
  x: index;
  y: index;
  direction: Dir;
  viewDistance: uint;
}
