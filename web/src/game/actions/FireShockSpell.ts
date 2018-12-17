import { Creature } from '../Creature';
import { Action } from './Action';

export class FireShockSpell implements Action {
  readonly posX: index;
  readonly posY: index;
  readonly creatureId: uint;

  constructor(
    public readonly time: tsm,
    public readonly id: uint,
    creature: Creature,
    public readonly duration: uint,
    public readonly distance: uint) {

    this.creatureId = creature.id;
    this.posX       = creature.positionX;
    this.posY       = creature.positionY;
  }

}