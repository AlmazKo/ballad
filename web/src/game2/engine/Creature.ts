import { Metrics } from '../../game/Metrics';
import { Orientation } from './Orientation';

export interface Creature {
  readonly id: uint;
  readonly orientation: Orientation;
  readonly metrics: Metrics;
}
