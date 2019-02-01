import { Dir } from '../game2/render/constants';

export interface Trait {
  readonly resName: string
  readonly  name: string
  readonly  isMoving: boolean
}


export class TraitStep implements Trait {
  readonly resName  = "";
  readonly name     = "Step";
  readonly isMoving = true;

  constructor(public readonly dir: Dir) {

  }
}

export class TraitCharge implements Trait {
  readonly resName  = "";
  readonly name     = "Charge";
  readonly isMoving = true;
}

export class TraitRun implements Trait {
  readonly resName  = "";
  readonly name     = "Run";
  readonly isMoving = true;
}

export class TraitMelee implements Trait {
  readonly resName  = "ico_melee";
  readonly name     = "Melee attack";
  readonly isMoving = false;
}

export class TraitFireball implements Trait {
  readonly resName  = "ico_fireball";
  readonly name     = "Cast fireball";
  readonly isMoving = false;
}

export class TraitFireshock implements Trait {
  readonly resName  = "ico_fireshock";
  readonly name     = "Cast fireshock";
  readonly isMoving = false;
}

export const Traits = {
  stepNorth: new TraitStep(Dir.NORTH),
  stepSouth: new TraitStep(Dir.SOUTH),
  stepWest : new TraitStep(Dir.WEST),
  stepEast : new TraitStep(Dir.EAST),
  charge   : new TraitCharge(),
  run      : new TraitRun(),
  melee    : new TraitMelee(),
  fireball : new TraitFireball(),
  fireshock: new TraitFireshock(),
};
