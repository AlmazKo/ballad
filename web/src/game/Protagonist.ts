import { Animator, Delay } from '../anim/Animator';
import { Animators } from '../anim/Animators';
import { Step } from './actions/Step';
import { ApiCreature } from './api/ApiCreature';
import { CELL, Dir, HCELL, QCELL } from './constants';
import { DrawableCreature, drawLifeLine, drawName } from './Creature';
import { RES } from './GameCanvas';
import { Metrics } from './Metrics';
import { Orientation } from './MovingKeys';
import { style } from './styles';
import { TilePainter, toX, toY } from './TilePainter';

export class Protagonist implements DrawableCreature {

  readonly id: int;
  readonly viewDistance: uint;
  readonly metrics: Metrics;
  direction: Dir;
  orientation: Orientation;
  positionX: int;
  positionY: int;

  shiftX                     = 0;
  shiftY                     = 0;
  isDead                     = false;
  private animators          = new Animators();
  private rotated            = false;
  private showInstantSpell   = false;
  private meleeFactor: float = 0;

  constructor(c: ApiCreature) {
    this.id           = c.id;
    this.metrics      = c.metrics;
    this.direction    = c.direction;
    this.orientation  = {moving: 0, sight: c.direction};
    this.positionX    = c.x;
    this.positionY    = c.y;
    this.viewDistance = c.viewDistance;
  }

  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }

  getX(): px {
    return toX(this.positionX) + this.shiftX + HCELL;
  }

  getY(): px {
    return toY(this.positionY) + this.shiftY + HCELL;
  }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

    this.animators.run(time);

    const actualCellX = this.shiftX < -HCELL ? this.positionX - 1 : (this.shiftX < HCELL ? this.positionX : this.positionX + 1);
    const actualCellY = this.shiftY < -HCELL ? this.positionY - 1 : (this.shiftY < HCELL ? this.positionY : this.positionY + 1);

    bp.fillRect(toX(actualCellX), toY(actualCellY), CELL, CELL, style.playerZone);


    let s: float, sx: px, sy: px;
    switch (this.direction) {
      case Dir.NORTH:
        sy = 64;
        s  = -this.shiftY / CELL;
        break;

      case Dir.SOUTH:
        sy = 0;
        s  = this.shiftY / CELL;
        break;

      case Dir.EAST:
        sy = 32;
        s  = this.shiftX / CELL;
        break;

      case Dir.WEST:
        sy = 96;
        s  = -this.shiftX / CELL;
        break;

      default:
        return;
    }

    const x = toX(this.positionX) + this.shiftX;
    const y = toY(this.positionY) + this.shiftY;
    sx      = Math.floor(s / 0.25) * 16;
    drawLifeLine(bp.toInDirect(x, y), this);

    let sw = 16, sh = 32;
    if (this.showInstantSpell) {
      sx = 7 * 16;
    } else if (this.meleeFactor) {
      sy += 32 * 4;
      sw = 16;
      sx = Math.floor(this.meleeFactor * 4) * 32 + 8;
    }

    bp.drawTile(RES.get("character"), sx, sy, sw, sh, this.positionX, this.positionY, this.shiftX + QCELL, this.shiftY);

    drawName(bp.toInDirect(x, y), this);
  }

  step(step: Step) {
    this.animators.interrupt("step");
    const dr       = step.direction;
    const movement = new Animator(step.duration, f => {
      console.log(f);
      if (f >= 1) {
        switch (dr) {
          case Dir.WEST:
            this.positionX--;
            break;
          case Dir.EAST:
            this.positionX++;
            break;
          case Dir.NORTH:
            this.positionY--;
            break;
          case Dir.SOUTH:
            this.positionY++;
            break;
        }
      } else {
        if (dr == Dir.WEST) this.shiftX = -f * CELL;
        if (dr == Dir.EAST) this.shiftX = f * CELL;
        if (dr == Dir.NORTH) this.shiftY = -f * CELL;
        if (dr == Dir.SOUTH) this.shiftY = f * CELL;
      }
    });

    this.animators.set("step", movement);
  }


  onRotated(rotated: boolean) {
    this.rotated = rotated;
  }


  onStep(step: Step): void {

    //todo add server sync
  }

  melee() {
    this.animators.set("melee", new Animator(250, f => {
      this.meleeFactor = f
    }), () => {
      this.meleeFactor = 0
    });
  }

  instantSpell() {
    this.showInstantSpell = true;
    this.animators.set("instant_spell", new Delay(100), () => {
      this.showInstantSpell = false
    });
  }

}