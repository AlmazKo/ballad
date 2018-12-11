import { index, tsm, uint } from '../../types';
import { Dir } from '../types';
import { Action } from './Action';
import { Creature } from '../Creature';

export class FireballSpell implements Action {
  readonly posX: index;
  readonly posY: index;
  readonly direction: Dir;

  constructor(
    public readonly time: tsm,
    public readonly id: uint,
    public readonly creature: Creature,
    public readonly duration: uint,
    public readonly distance: uint) {

    this.posX      = creature.positionX;
    this.posY      = creature.positionY;
    this.direction = creature.direction;
  }

}