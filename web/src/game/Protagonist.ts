import { Animator, Delay } from '../anim/Animator';
import { Animators } from '../anim/Animators';
import { ApiCreature } from './api/ApiCreature';
import { CELL, Dir, QCELL } from './constants';
import { DrawableCreature, drawName } from './Creature';
import { RES } from './layers/GameCanvas';
import { Metrics } from './Metrics';
import { Orientation2 } from './Orientation';
import { TilePainter, toX1, toY1 } from './TilePainter';

export class Protagonist222 implements DrawableCreature {

  readonly id: int;
  readonly viewDistance: uint;
  readonly metrics: Metrics;
  orientation: Orientation2;

  isDead                     = false;
  private animators          = new Animators();
  // private rotated            = false;
  private showInstantSpell   = false;
  private meleeFactor: float = 0;

  constructor(c: ApiCreature) {
    this.id           = c.id;
    this.metrics      = c.metrics;
    this.orientation  = {moving: 0, sight: c.direction, posX: c.x, posY: c.y, shift: 0};
    this.viewDistance = c.viewDistance;
  }

  // getLifeShare(): float {
  //   return this.metrics.life / this.metrics.maxLife;
  // }
  //
  // getX(): px {
  //   return toX(this.positionX) + this.shiftX + HCELL;
  // }
  //
  // getY(): px {
  //   return toY(this.positionY) + this.shiftY + HCELL;
  // }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

    this.animators.run(time);

    // const actualCellX = this.shiftX < -HCELL ? this.positionX - 1 : (this.shiftX < HCELL ? this.positionX : this.positionX + 1);
    // const actualCellY = this.shiftY < -HCELL ? this.positionY - 1 : (this.shiftY < HCELL ? this.positionY : this.positionY + 1);
    // bp.fillRect(toX(actualCellX), toY(actualCellY), CELL, CELL, style.playerZone);
    //

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

    drawName(bp.toInDirect(x, y), this);
  }

  // step(step: Step) {
  //   this.animators.interrupt("step");
  //   const dr                = step.direction;
  //   this.orientation.moving = dr;
  //   // const movement          = new Animator(step.duration, f => {
  //   //   if (f >= 1) {
  //   //     switch (dr) {
  //   //       case Dir.WEST:
  //   //         break;
  //   //       case Dir.EAST:
  //   //         this.positionX++;
  //   //         break;
  //   //       case Dir.NORTH:
  //   //         this.positionY--;
  //   //         break;
  //   //       case Dir.SOUTH:
  //   //         this.positionY++;
  //   //         break;
  //   //     }
  //   //
  //   //     this.shiftX = 0;
  //   //     this.shiftY = 0;
  //   //
  //   //     this.orientation.moving = 0;
  //   //   } else {
  //   //     if (dr == Dir.WEST) this.shiftX = -f * CELL;
  //   //     if (dr == Dir.EAST) this.shiftX = f * CELL;
  //   //     if (dr == Dir.NORTH) this.shiftY = -f * CELL;
  //   //     if (dr == Dir.SOUTH) this.shiftY = f * CELL;
  //   //   }
  //   // });
  //
  //   this.animators.set("step", movement);
  // }

  // onRotated(rotated: boolean) {
  //   this.rotated = rotated;
  // }
  //
  //
  // onStep(step: Step): void {
  //
  //   //todo add server sync
  // }

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
