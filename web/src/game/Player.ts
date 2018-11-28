import {Animator, LoopAnimator} from '../anim/Animator';
import {BasePainter} from '../draw/BasePainter';
import {float, index, px, uint} from '../types';
import {CELL, Dir, HCELL, QCELL} from './types';
import {style} from './styles';
import {Moving} from './Moving';
import {ViewMap} from './ViewMap';
import {Drawable} from './Drawable';
import {Creature, drawLifeLine, drawName} from './Creature';
import {RES} from '../index';
import {Metrics} from './Metrics';
import {Step} from './actions/Step';
import {Server} from './Server';

export class Player implements Creature, Drawable {

  id: uint = 1;//fixme harcoded
  private readonly moving: Moving;
  private map: ViewMap;
  metrics: Metrics;
  private server: Server;

  constructor(moving: Moving, map: ViewMap, metrics: Metrics, server: Server) {
    this.moving = moving;
    this.map = map;
    this.metrics = metrics;
    this.server = server;
  }


  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }


  getX(): px {
    return this.positionX * CELL + this.shiftX;
  }

  getY(): px {
    return this.positionY * CELL + this.shiftY;
  }


  direction = Dir.DOWN;
  positionX = 17;
  positionY = 10;
  shiftX = 0;
  shiftY = 0;

  private nextPosition: [index, index] | null = null;
  private movement: Animator = null;
  private lastAnimIdx: index = 0;
  private frozen: Dir = 0;
  private rotated = false;

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {

    if (this.movement) {
      this.movement.run(time);
    }

    let x: px = this.positionX * CELL + this.shiftX,
      y: px = this.positionY * CELL + this.shiftY;


    const actualCellX = this.shiftX < HCELL ? this.positionX * CELL : this.positionX * CELL + CELL;
    const actualCellY = this.shiftY < HCELL ? this.positionY * CELL : this.positionY * CELL + CELL;
    bp.fillRect(actualCellX, actualCellY, CELL, CELL, style.playerZone);

    drawLifeLine(bp, this);
    let s: float, sx: px, sy: px;
    switch (this.direction) {
      case Dir.UP:
        sy = 64;
        s = -this.shiftY / CELL;
        break;

      case Dir.DOWN:
        sy = 0;
        s = this.shiftY / CELL;
        break;

      case Dir.RIGHT:
        sy = 32;
        s = this.shiftX / CELL;
        break;

      case Dir.LEFT:
        sy = 96;
        s = -this.shiftX / CELL;
        break
    }

    sx = Math.floor(s / 0.25) * 16;

    bp.ctx.drawImage(RES["character"], sx, sy, 16, 32, x + QCELL, y, 16, 32);
    drawName(bp, this);
  }


  nextPos(dr: Dir): [index, index] {
    switch (dr) {
      case Dir.LEFT:
        return [this.positionX - 1, this.positionY];
      case Dir.RIGHT:
        return [this.positionX + 1, this.positionY];
      case Dir.UP:
        return [this.positionX, this.positionY - 1];
      case Dir.DOWN:
        return [this.positionX, this.positionY + 1];
    }
  }

  onStep(direction: number) {

    if (this.rotated) {
      this.direction = direction;
      return;
    }

    this.moving.add(direction);

    if (this.movement) return;

    const dr = this.moving.next();
    this.mm(dr);
  }

  mm(dr: Dir) {
    const nextPs = this.nextPos(dr);
    this.direction = this.frozen ? this.frozen : dr;

    if (this.map.canMove([this.positionY, this.positionY], nextPs)) {
      console.info("START NEW " + dr);
    } else {
      console.warn("Forbidden direction " + dr);
      return
    }

    const step = new Step(this, 250);
    this.server.sendAction(step);

    this.movement = new Animator(step.speed, (f) => {
      const isNewPos = f >= 1;

      if (!isNewPos) {
        this.updMoving(dr, f);
        return;
      }

      switch (dr) {
        case Dir.LEFT:
          this.positionX--;
          break;
        case Dir.RIGHT:
          this.positionX++;
          break;
        case Dir.UP:
          this.positionY--;
          break;
        case Dir.DOWN:
          this.positionY++;
          break;
      }
      this.shiftX = 0;
      this.shiftY = 0;
      this.movement = null;

      const next = this.moving.next();

      if (next) this.mm(next);

      console.warn("NEXT " + next);
    });

  }

  updMoving(curr: Dir, f: float) {
    if (curr == Dir.LEFT) this.shiftX = -f * CELL;
    if (curr == Dir.RIGHT) this.shiftX = f * CELL;
    if (curr == Dir.UP) this.shiftY = -f * CELL;
    if (curr == Dir.DOWN) this.shiftY = f * CELL;
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