import { ApiCreature } from './ApiCreature';
import { ApiEvent } from './ApiEvent';

export interface ApiArrival extends ApiEvent {
  creature: ApiCreature
}
