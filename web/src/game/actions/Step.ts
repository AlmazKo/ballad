import { index, ms, tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { nextId } from '../../index';
import { Dir } from '../types';

export class Step implements Action {
  readonly fromPosX: index;
  readonly fromPosY: index;
  readonly direction: Dir;
  readonly speed: ms;
  readonly id: uint;
  readonly source: Creature;
  readonly time: tsm;

  constructor(source: Creature, speed: uint, direction: Dir = source.direction) {

    this.id        = nextId();
    this.time      = Date.now();//fixme take it from performance*
    this.source    = source;
    this.fromPosX  = source.positionX;
    this.fromPosY  = source.positionY;
    this.direction = direction;

    this.speed = speed;
  }


}