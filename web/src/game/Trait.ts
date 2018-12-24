export enum PlayerAction {
  FIREBALL = 1,
  FIRESHOCK,
  STEP,
  MELEE
}


export class Trait {
  constructor(
    public readonly resName: string,
    public readonly  action: PlayerAction) {
  }
}

export const Traits = {
  melee    : new Trait('ico_melee', PlayerAction.MELEE),
  fireball : new Trait('ico_fireball', PlayerAction.FIREBALL),
  fireshock: new Trait('ico_fireshock', PlayerAction.FIRESHOCK),
};