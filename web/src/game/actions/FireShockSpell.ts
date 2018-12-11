import { index, tsm, uint } from '../../types';
import { Action } from './Action';
import { Creature } from '../Creature';

export class FireShockSpell implements Action {
  readonly posX: index;
  readonly posY: index;

  constructor(
    public readonly time: tsm,
    public readonly id: uint,
    public readonly creature: Creature,
    public readonly duration: uint,
    public readonly distance: uint) {

    this.posX = creature.positionX;
    this.posY = creature.positionY;
  }

}