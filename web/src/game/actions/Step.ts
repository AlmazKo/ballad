import { index, int, ms, tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { Dir } from '../types';

export class Step implements Action {
  fromPosX: index;
  fromPosY: index;
  readonly direction: Dir;
  readonly duration: ms;
  readonly id: uint;
  readonly creature: Creature;
  readonly time: tsm;

  constructor(id: int, source: Creature, duration: uint, direction: Dir = source.direction) {

    this.id        = id;
    this.time      = Date.now();//fixme take it from performance*
    this.creature  = source;
    this.fromPosX  = source.positionX;
    this.fromPosY  = source.positionY;
    this.direction = direction;

    this.duration = duration;
  }


}