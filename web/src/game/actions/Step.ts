import { Dir } from '../../game2/constants';
import { Creature } from '../../game2/engine/Creature';
import { Action } from './Action';

export class Step implements Action {
  initX: index;
  initY: index;
  readonly direction: Dir;
  readonly duration: ms;
  readonly id: uint;
  readonly creature: Creature;
  readonly time: tsm;

  constructor(id: int, source: Creature, duration: uint, direction: Dir = source.orientation.moving) {

    this.id        = id;
    this.time      = Date.now();//fixme take it from performance*
    this.creature  = source;
    this.initX     = source.orientation.x;
    this.initY     = source.orientation.y;
    this.direction = direction;

    this.duration = duration;
  }


}
