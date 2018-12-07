import { DrawableCreature, drawLifeLine, drawName } from './Creature';
import { CELL, Dir, QCELL } from './types';
import { float, index, px, uint } from '../types';
import { RES } from './GameCanvas';
import { Metrics } from './Metrics';
import { Step } from './actions/Step';
import { Animator } from '../anim/Animator';
import { TilePainter } from './TilePainter';
import { ApiCreature } from './api/ApiCreature';
import { PROTO_X, PROTO_Y } from './Lands';
import { inZone } from './util';

export class Npc implements DrawableCreature {

  readonly id: uint;
  positionX: index;
  positionY: index;
  direction: Dir;
  readonly metrics: Metrics;
  readonly isPlayer: boolean;

  shiftX    = 0;
  shiftY    = 0;
  private movement: Animator | undefined;
  private f = 0;

  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }

  constructor(c: ApiCreature) {
    this.id        = c.id;
    this.metrics   = c.metrics;
    this.direction = c.direction;
    this.positionX = c.x;
    this.positionY = c.y;
    this.isPlayer  = c.isPlayer;
  }


  onStep(step: Step) {
    this.direction = step.direction;
    this.positionX = step.fromPosX;
    this.positionY = step.fromPosY;

    if (this.movement && !this.movement.isFinished()) {
      this.movement.reset();
      this.shiftY = 0;
      this.shiftX = 0;
      this.f      = 0;
    }

    this.movement = new Animator(step.duration, f => {
      this.f = f;
      if (f >= 1) {

        switch (step.direction) {
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

        this.f      = 0;
        this.shiftX = 0;
        this.shiftY = 0;
      } else {
        if (step.direction === Dir.WEST) this.shiftX = -f * CELL;
        if (step.direction === Dir.EAST) this.shiftX = f * CELL;
        if (step.direction === Dir.NORTH) this.shiftY = -f * CELL;
        if (step.direction === Dir.SOUTH) this.shiftY = f * CELL;
      }


    });

  }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

    if (this.movement && !this.movement.isFinished()) this.movement.run(time);
    let sy: px;

    switch (this.direction) {
      case Dir.NORTH:
        sy = 64;
        break;

      case Dir.SOUTH:
        sy = 0;
        break;

      case Dir.EAST:
        sy = 32;
        break;

      case Dir.WEST:
        sy = 96;
        break;

      default:
        return;
    }


    const p = bp.toInTile(this.positionX, this.positionY, this.shiftX, this.shiftY);

    const inZon = inZone(this.positionX, this.positionY, PROTO_X, PROTO_Y, 3)

    if (inZon) drawLifeLine(p, this);
    const sx = Math.floor(this.f * 4) * 16;

    let img;
    if (this.isPlayer) {
      img = RES["character_alien"]
    } else {
      img = RES["NPC_test"]
    }

    bp.drawTile(img, sx, sy, 16, 32, this.positionX, this.positionY, this.shiftX + QCELL, this.shiftY);

    if (inZon) drawName(p, this);
  }


}