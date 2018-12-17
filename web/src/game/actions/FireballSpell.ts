import { Dir } from '../constants';
import { Action } from './Action';

export class FireballSpell implements Action {
  constructor(
    public readonly time: tsm,
    public readonly id: uint,
    public readonly creatureId: uint,
    public readonly duration: uint,
    public readonly distance: uint,
    public readonly posX: uint,
    public readonly posY: uint,
    public readonly direction: Dir,
  ) {

  }

}