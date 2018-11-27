import { tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { Npc } from '../Npc';
import { Metrics } from '../Metrics';

export class Arrival implements Action {
  readonly id: uint;
  readonly source: Creature;
  readonly time: tsm;

  constructor(type: String, data: any) {

    switch (type) {
      case "ballad.server.api.Npc":
        const m     = new Metrics(data.metrics.life, data.metrics.name);
        this.source = new Npc(m, data.x, data.y);
        break;
    }


  }


  // constructor(source: Creature) {
  //   this.id     = nextId();
  //   this.time   = Date.now();//fixme take it from performance*
  //   this.source = source;
  // }
}