import { index, int, tsm, uint } from '../../types';
import { Dir } from '../types';
import { Action } from './Action';
import { Creature } from '../Creature';

export class FireballSpell implements Action {
  readonly posX: index;
  readonly posY: index;
  readonly direction: Dir;
  readonly duration: uint;
  readonly distance: uint;

  readonly id: uint;
  readonly creature: Creature;
  readonly time: tsm;

  constructor(id: int, source: Creature, duration: uint, distance: uint) {

    this.id        = id;
    this.time      = Date.now();//fixme take it from performance*
    this.creature  = source;
    this.posX      = source.positionX;
    this.posY      = source.positionY;
    this.direction = source.direction;

    this.duration = duration;
    this.distance = distance;
  }

}