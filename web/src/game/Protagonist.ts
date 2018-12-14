import { Animator, Delay, LoopAnimator } from '../anim/Animator';
import { float, index, int, px, uint } from '../types';
import { CELL, Dir, HCELL, QCELL } from './types';
import { DrawableCreature, drawLifeLine, drawName } from './Creature';
import { Step } from './actions/Step';
import { Metrics } from './Metrics';
import { RES } from './GameCanvas';
import { ApiCreature } from './api/ApiCreature';
import { MovingKeys } from './MovingKeys';
import { Lands } from './Lands';
import { TilePainter, toX, toY } from './TilePainter';
import { style } from './styles';
import { Game, PlayerAction } from './Game';
import { Animators } from '../anim/Animators';

export class Protagonist implements DrawableCreature {

  readonly id: int;
  readonly viewDistance: uint;
  readonly metrics: Metrics;
  direction: Dir;
  positionX: int;
  positionY: int;

  shiftX = 0;
  shiftY = 0;

  private animators          = new Animators();
  private lastAnimIdx: index = 0;
  private frozen: Dir        = 0;
  private rotated            = false;
  isDead                     = false;
  private showInstantSpell   = false;
  private meleeFactor: float = 0;


  constructor(c: ApiCreature,
              private moving: MovingKeys,
              private map: Lands,
              private game: Game) {
    this.id           = c.id;
    this.metrics      = c.metrics;
    this.direction    = c.direction;
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

    bp.drawTile(RES["character"], sx, sy, sw, sh, this.positionX, this.positionY, this.shiftX + QCELL, this.shiftY);

    drawName(bp.toInDirect(x, y), this);
  }


  nextPos(dr: Dir): [index, index] {
    switch (dr) {
      case Dir.WEST:
        return [this.positionX - 1, this.positionY];
      case Dir.EAST:
        return [this.positionX + 1, this.positionY];
      case Dir.NORTH:
        return [this.positionX, this.positionY - 1];
      case Dir.SOUTH:
        return [this.positionX, this.positionY + 1];
    }
  }

  step(direction: number) {

    if (this.rotated) {
      this.direction = direction;
      return;
    }

    this.moving.add(direction);

    if (this.animators.has("step")) return;

    const dr = this.moving.next();
    this.doStep(dr);
  }

  doStep(dr: Dir) {
    this.direction = this.frozen ? this.frozen : dr;

    if (this.map.canStep([this.positionX, this.positionY], this.direction)) {
      console.info("START NEW " + dr);
    } else {
      console.warn("Forbidden direction " + dr);
      return
    }

    const step = this.game.sendAction(PlayerAction.STEP) as Step;

    const movement = new LoopAnimator(step.duration, (f, i) => {
      let isActionContinue = true;
      let next             = 0;
      const isNewPos       = i > this.lastAnimIdx;

      if (isNewPos) {
        next = this.moving.next();
        console.warn("NEXT " + next);

        isActionContinue = dr === next;

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

        if (isActionContinue && !this.map.canStep([this.positionX, this.positionY], next)) {
          isActionContinue = false
        }

        if (isActionContinue) {
          this.game.sendAction(PlayerAction.STEP);
        }

        console.log(`Stop movement, isContinue=${isActionContinue}, next=${next}`);
      }


      if (isActionContinue) {
        if (dr == Dir.WEST) this.shiftX = -f * CELL;
        if (dr == Dir.EAST) this.shiftX = f * CELL;
        if (dr == Dir.NORTH) this.shiftY = -f * CELL;
        if (dr == Dir.SOUTH) this.shiftY = f * CELL;
      } else {
        this.shiftX = 0;
        this.shiftY = 0;
      }


      if (isNewPos) {

        if (isActionContinue) {
          this.lastAnimIdx = i;
        } else {
          this.lastAnimIdx = 0;
          if (next) this.doStep(next);

          return true;
        }
      }

      return false;

    });

    this.animators.set("step", movement);
  }

  updMoving(curr: Dir, f: float) {
    if (curr == Dir.WEST) this.shiftX = -f * CELL;
    if (curr == Dir.EAST) this.shiftX = f * CELL;
    if (curr == Dir.NORTH) this.shiftY = -f * CELL;
    if (curr == Dir.SOUTH) this.shiftY = f * CELL;
  }

  onFreezeDirection(frozen: boolean) {
    if (frozen) {
      this.frozen = this.direction;
    } else {
      this.frozen = 0;
    }
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