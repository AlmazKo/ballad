import { index, tsm, uint } from '../../types';
import { Dir } from '../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { nextId } from '../../index';

export class FireballSpell implements Action {
  readonly posX: index;
  readonly posY: index;
  readonly direction: Dir;
  readonly speed: uint;
  readonly distance: uint;

  readonly id: uint;
  readonly source: Creature;
  readonly time: tsm;

  constructor(source: Creature, speed: uint, distance: uint) {

    this.id        = nextId();
    this.time      = Date.now();//fixme take it from performance*
    this.source    = source;
    this.posX      = source.positionX;
    this.posY      = source.positionY;
    this.direction = source.direction;

    this.speed    = speed;
    this.distance = distance;
  }

}