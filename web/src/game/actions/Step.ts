import { Dir } from '../constants';
import { Creature } from '../Creature';
import { Action } from './Action';

export class Step implements Action {
  fromPosX: index;
  fromPosY: index;
  readonly direction: Dir;
  readonly duration: ms;
  readonly id: uint;
  readonly creatureId: uint;
  readonly time: tsm;

  constructor(id: int, source: Creature, duration: uint, direction: Dir = source.direction) {

    this.id         = id;
    this.time       = Date.now();//fixme take it from performance*
    this.creatureId = source.id;
    this.fromPosX   = source.positionX;
    this.fromPosY   = source.positionY;
    this.direction  = direction;

    this.duration = duration;
  }


}