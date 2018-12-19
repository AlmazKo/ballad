import { LoopAnimator } from '../../anim/Animator';
import { FireballSpell } from '../actions/FireballSpell';
import { CELL, Dir } from '../constants';
import { Effect } from '../Effect';
import { RES } from '../GameCanvas';
import { Lands } from '../Lands';
import { TilePainter } from '../TilePainter';

export class Fireball implements Effect {
  private readonly posX: index;
  private readonly posY: index;
  private readonly direction: Dir;

  private lastAnimIndex = 0;
  private shift: px     = 0;
  private readonly anim: LoopAnimator;
  isFinished            = false;
  private f: float      = 0;
  private map: Lands;
  id: uint;

  constructor(spec: FireballSpell, map: Lands) {
    this.id        = spec.id;
    this.direction = spec.direction;
    this.posX      = spec.posX;
    this.posY      = spec.posY;
    this.map       = map;
    this.anim      = new LoopAnimator(spec.duration, (f, i) => {

        if (i > this.lastAnimIndex) {
          const from = this.getPosition(this.lastAnimIndex);
          const to   = this.getPosition(i);

          if (!this.map.canMove(from, to, true)) {
            this.isFinished = true;
            return true;
          } else {
            this.lastAnimIndex = i;
          }
        }

        if (i >= spec.distance) {
          this.isFinished = true;
          return true;
        } else {
          this.f     = f;
          this.shift = (i + f) * CELL;
          return false;
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

      default:
        return;
    }

    const sx: px = 32 * Math.floor(this.f * 4);
    const fire1  = RES.get("fireball_32");

    bp.drawTile(fire1, sx, sy, 32, 32, this.posX, this.posY, shiftX, shiftY);
  }

  stop(): void {
    this.anim.finish();
    this.isFinished = true;
  }

}