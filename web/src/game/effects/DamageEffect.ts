import { Effect } from '../Effect';
import { float, index, int, px } from '../../types';
import { Animator } from '../../anim/Animator';
import { TilePainter } from '../TilePainter';
import { ApiDamage } from '../api/ApiDamage';
import { style } from '../styles';
import { HCELL } from '../types';

export class DamageEffect implements Effect {
  readonly id = 0;
  isFinished  = false;
  private readonly posX: index;
  private readonly posY: index;
  private readonly amount: int;

  private shift: px = 0;
  private anim: Animator;
  private f: float  = 0;

  constructor(spec: ApiDamage) {
    this.amount = spec.amount;
    this.posX   = spec.x;
    this.posY   = spec.y;
    this.anim   = new Animator(300, f => {
      this.f = f;
      if (f >= 1) this.isFinished = true;
    });
  }


  draw(time: DOMHighResTimeStamp, p: TilePainter) {

    this.anim.run(time);
    const shiftY = this.f * 10;
    p.toInTile(this.posX, this.posY).text("" + this.amount, HCELL, -shiftY, style.dmgText2);
    p.toInTile(this.posX, this.posY).text("" + this.amount, HCELL, -shiftY, style.dmgText);

  }


  stop(): void {
    this.anim.finish();
    this.isFinished = true;
  }
}