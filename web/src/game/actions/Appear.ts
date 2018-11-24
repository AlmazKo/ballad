import { tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';
import { nextId } from '../../index';

export class Appear implements Action {
  readonly id: uint;
  readonly source: Creature;
  readonly time: tsm;

  constructor(source: Creature) {
    this.id     = nextId();
    this.time   = Date.now();//fixme take it from performance*
    this.source = source;
  }
}