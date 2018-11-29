import { Spell } from '../Spell';
import { float, index, px } from '../../types';
import { LoopAnimator } from '../../anim/Animator';
import { BasePainter } from '../../draw/BasePainter';
import { CELL, Dir } from '../types';
import { RES } from '../..';
import { ViewMap } from '../ViewMap';
import { FireballSpell } from '../actions/FireballSpell';

export class Fireball implements Spell {
  private readonly posX: index;
  private readonly posY: index;
  private readonly direction: Dir;

  private lastAnimIndex = 0;
  private shift: px     = 0;
  private anim: LoopAnimator;
  isFinished            = false;
  private f: float;
  private map: ViewMap;

  constructor(spec: FireballSpell, map: ViewMap) {
    this.direction = spec.direction;
    this.posX      = spec.posX;
    this.posY      = spec.posY;
    this.map       = map;
    this.anim      = new LoopAnimator(spec.duration, (f, i) => {

        if (i > this.lastAnimIndex) {
          const from = this.getPosition(this.lastAnimIndex);
          const to   = this.getPosition(i);

          if (!this.map.canMove(from, to, true)) {
            this.anim.finish();
            this.isFinished = true;
          } else {
            this.lastAnimIndex = i;
          }
        }

        if (i >= spec.distance) {
          this.anim.finish();
          this.isFinished = true;
        } else {
          this.f     = f;
          this.shift = (i + f) * CELL;
        }
      }
    );
  }

  getPosition(animIdx: index): [px, px] {
    switch (this.direction) {
      case Dir.UP:
        return [this.posX, this.posY - animIdx];
      case Dir.DOWN:
        return [this.posX, this.posY + animIdx];
      case Dir.LEFT:
        return [this.posX - animIdx, this.posY];
      case Dir.RIGHT:
        return [this.posX + animIdx, this.posY];
    }
  }

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {

    this.anim.run(time);
    let shiftX: px = 0, shiftY: px = 0;
    let sx: px, sy: px;
    switch (this.direction) {
      case Dir.UP:
        shiftY = -this.shift;
        sy     = 32 * 2;
        break;
      case Dir.DOWN:
        shiftY = this.shift;
        sy     = 32 * 6;
        break;
      case Dir.LEFT:
        shiftX = -this.shift;
        sy     = 0;
        break;
      case Dir.RIGHT:
        shiftX = this.shift;
        sy     = 32 * 4;
        break;
    }

    sx = 32 * Math.floor(this.f / 0.25);

    let x: px = this.posX * CELL + shiftX,
        y: px = this.posY * CELL + shiftY;

    const fire1 = RES["fireball_32"];

    bp.ctx.drawImage(fire1, sx, sy, 32, 32, x, y, 32, 32);
  }

}