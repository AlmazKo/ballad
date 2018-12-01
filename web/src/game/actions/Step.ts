import { index, ms, tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { Dir } from '../types';
import { nextId } from '../Game';

export class Step implements Action {
  fromPosX: index;
  fromPosY: index;
  direction: Dir;
  duration: ms;
  id: uint;
  creature: Creature;
  time: tsm;

  constructor(source: Creature, duration: uint, direction: Dir = source.direction) {

    this.id        = nextId();
    this.time      = Date.now();//fixme take it from performance*
    this.creature  = source;
    this.fromPosX  = source.positionX;
    this.fromPosY  = source.positionY;
    this.direction = direction;

    this.duration = duration;
  }


}