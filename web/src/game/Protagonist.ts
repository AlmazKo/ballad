import { LoopAnimator } from '../anim/Animator';
import { float, index, int, px } from '../types';
import { CELL, Dir, HCELL, QCELL } from './types';
import { DrawableCreature, drawLifeLine, drawName } from './Creature';
import { Step } from './actions/Step';
import { Metrics } from './Metrics';
import { RES } from './GameCanvas';
import { ApiCreature } from './api/ApiCreature';
import { MovingKeys } from './MovingKeys';
import { Lands } from './Lands';
import { Server } from './api/Server';
import { TilePainter, toX, toY } from './TilePainter';

export class Protagonist implements DrawableCreature {


  onStep(step: Step): void {

    //add sync
  }

  readonly id: int;
  readonly metrics: Metrics;
  direction: Dir;
  positionX: int;
  positionY: int;

  shiftX = 0;
  shiftY = 0;

  private movement: LoopAnimator = null;
  private lastAnimIdx: index     = 0;
  private frozen: Dir            = 0;
  private rotated                = false;


  constructor(c: ApiCreature,
              private moving: MovingKeys,
              private map: Lands,
              private server: Server) {
    this.id        = c.id;
    this.metrics   = c.metrics;
    this.direction = c.direction;
    this.positionX = c.x;
    this.positionY = c.y;
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

    if (this.movement) {
      this.movement.run(time);
    }

    const actualCellX = this.shiftX < HCELL ? this.positionX : this.positionX + 1;
    const actualCellY = this.shiftY < HCELL ? this.positionY : this.positionY + 1;

    // bp.fillRect(actualCellX, actualCellY, CELL, CELL, style.playerZone);


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
        break
    }

    const x = toX(this.positionX) + this.shiftX;
    const y = toY(this.positionY) + this.shiftY;
    sx      = Math.floor(s / 0.25) * 16;
    drawLifeLine(bp.toInDirect(x, y), this);
    bp.drawTile(RES["character"], sx, sy, 16, 32, this.positionX, this.positionY, this.shiftX + QCELL, this.shiftY);

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

    if (this.movement) return;

    const dr = this.moving.next();
    this.doStep(dr);
  }

  doStep(dr: Dir) {
    const nextPs   = this.nextPos(dr);
    this.direction = this.frozen ? this.frozen : dr;

    if (this.map.canMove([this.positionY, this.positionY], nextPs)) {
      console.info("START NEW " + dr);
    } else {
      console.warn("Forbidden direction " + dr);
      return
    }

    const step = new Step(this, 400);
    this.server.sendAction(step);

    this.movement = new LoopAnimator(step.duration, (f, i) => {
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

        if (isActionContinue && !this.map.canMove([this.positionY, this.positionY], this.nextPos(next))) {
          isActionContinue = false
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
          this.movement.finish();
          this.movement = null;

          if (next) this.doStep(next);
        }
      }

    });

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
}