import { index, uint } from '../../types';
import { Metrics } from '../Metrics';
import { Dir } from '../types';

export interface ApiCreature {
  id: uint;
  metrics: Metrics;
  isPlayer: boolean,
  x: index;
  y: index;
  direction: Dir;
  viewDistance: uint;
}