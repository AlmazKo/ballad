import { tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { Npc } from '../Npc';
import { Metrics } from '../Metrics';

export class Arrival implements Action {
  readonly id: uint;
  readonly creature: Creature;
  readonly time: tsm;

  constructor(data: any) {


    const m     = new Metrics(data.creature.metrics.life, data.creature.metrics.name);
    this.creature = new Npc(m, data.creature.x, data.creature.y);


  }


  // constructor(source: Creature) {
  //   this.id     = nextId();
  //   this.time   = Date.now();//fixme take it from performance*
  //   this.source = source;
  // }
}