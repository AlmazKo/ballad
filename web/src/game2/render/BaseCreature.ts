import { Animator, Delay, LoopAnimator } from '../../anim/Animator';
import { Animators } from '../../anim/Animators';
import { TileDrawable } from '../../game/TileDrawable';
import { TilePainter, toX1, toY1 } from '../../game/TilePainter';
import { get } from '../../Module';
import { Dir } from '../constants';
import { StartMoving } from '../engine/actions/StartMoving';
import { Creature } from '../engine/Creature';
import { Orientation } from '../engine/Orientation';
import { Images } from '../Images';
import { CELL, QCELL } from './constants';


export const RES = get<Images>('images');

export class DrawableCreature implements TileDrawable {

  readonly orientation: Orientation;

  private animators          = new Animators();
  private showInstantSpell   = false;
  private meleeFactor: float = 0;

  constructor(c: Creature) {
    this.orientation = c.orientation;
  }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

    this.animators.run(time);

    let s: float, sx: px, sy: px;
    const o = this.orientation;
    switch (o.sight) {
      case Dir.NORTH:
        sy = 64;
        s  = -o.shift / CELL;
        break;

      case Dir.SOUTH:
        sy = 0;
        s  = o.shift / CELL;
        break;

      case Dir.EAST:
        sy = 32;
        s  = o.shift / CELL;
        break;

      case Dir.WEST:
        sy = 96;
        s  = -o.shift / CELL;
        break;

      default:
        return;
    }


    const x = toX1(o);
    const y = toY1(o);
    sx      = Math.floor(s / 0.25) * 16;
    // drawLifeLine(bp.toInDirect(x, y), this);

    let sw = 16, sh = 32;
    if (this.showInstantSpell) {
      sx = 7 * 16;
    } else if (this.meleeFactor) {
      sy += 32 * 4;
      sw = 16;
      sx = Math.floor(this.meleeFactor * 4) * 32 + 8;
    }

    bp.draw("character", sx, sy, sw, sh, x + QCELL, y);

  }

  startMoving(a: StartMoving) {
    this.animators.interrupt("step");
    const dr       = a.dir;
    const o        = this.orientation;
    o.moving       = dr;
    const movement = new LoopAnimator(a.speed, (f, i) => {
      if (f >= 1) {
        switch (dr) {
          case Dir.WEST:
            o.x--;
            break;
          case Dir.EAST:
            o.x++;
            break;
          case Dir.NORTH:
            o.y--;
            break;
          case Dir.SOUTH:
            o.y++;
            break;
        }
        o.shift = f - 1;
      } else {
        o.shift = f;
      }

      return true;
    });

    this.animators.set("step", movement);
  }

  stopMoving() {
    this.animators.interrupt("step");
  }

  // onRotated(rotated: boolean) {
  //   this.rotated = rotated;
  // }
  //
  //
  // onStep(step: Step): void {
  //
  //   //todo add server sync
  // }

  move() {

  }


  melee() {
    this.animators.set("melee",
      new Animator(250, f => this.meleeFactor = f),
      () => this.meleeFactor = 0);
  }

  instantSpell() {
    this.showInstantSpell = true;
    this.animators.set("instant_spell",
      new Delay(100),
      () => this.showInstantSpell = false);
  }

}
