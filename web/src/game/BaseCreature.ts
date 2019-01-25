import { Animator, Delay } from '../anim/Animator';
import { Animators } from '../anim/Animators';
import { ApiCreature } from './api/ApiCreature';
import { CELL, Dir, QCELL } from './constants';
import { RES } from './layers/GameCanvas';
import { Orientation2 } from './Orientation';
import { TileDrawable } from './TileDrawable';
import { TilePainter, toX1, toY1 } from './TilePainter';

export class DrawableCreature implements TileDrawable {

  readonly orientation: Orientation2;

  private animators          = new Animators();
  private showInstantSpell   = false;
  private meleeFactor: float = 0;

  constructor(c: ApiCreature) {

    this.orientation = {moving: 0, sight: c.direction, posX: c.x, posY: c.y, shift: 0};
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

    bp.drawTile(RES.get("character"), sx, sy, sw, sh, x + QCELL, y);

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
