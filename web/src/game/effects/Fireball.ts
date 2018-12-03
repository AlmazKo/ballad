import { Spell } from '../Spell';
import { float, index, px } from '../../types';
import { LoopAnimator } from '../../anim/Animator';
import { CELL, Dir } from '../types';
import { Lands } from '../Lands';
import { FireballSpell } from '../actions/FireballSpell';
import { RES } from '../GameCanvas';
import { TilePainter } from '../TilePainter';

export class Fireball implements Spell {
  private readonly posX: index;
  private readonly posY: index;
  private readonly direction: Dir;

  private lastAnimIndex = 0;
  private shift: px     = 0;
  private anim: LoopAnimator;
  isFinished            = false;
  private f: float;
  private map: Lands;

  constructor(spec: FireballSpell, map: Lands) {
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
      case Dir.NORTH:
        return [this.posX, this.posY - animIdx];
      case Dir.SOUTH:
        return [this.posX, this.posY + animIdx];
      case Dir.WEST:
        return [this.posX - animIdx, this.posY];
      case Dir.EAST:
        return [this.posX + animIdx, this.posY];
    }
  }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

    this.anim.run(time);
    let shiftX: px = 0, shiftY: px = 0;
    let sy: px;
    switch (this.direction) {
      case Dir.NORTH:
        shiftY = -this.shift;
        sy     = 32 * 2;
        break;
      case Dir.SOUTH:
        shiftY = this.shift;
        sy     = 32 * 6;
        break;
      case Dir.WEST:
        shiftX = -this.shift;
        sy     = 0;
        break;
      case Dir.EAST:
        shiftX = this.shift;
        sy     = 32 * 4;
        break;
    }

    const sx: px = 32 * Math.floor(this.f * 4);
    const fire1 = RES["fireball_32"];

    bp.drawTile(fire1, sx, sy, 32, 32, this.posX, this.posY, shiftX, shiftY);
  }

}