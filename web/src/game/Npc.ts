import { DrawableCreature, drawLifeLine, drawName } from './Creature';
import { CELL, Dir, QCELL } from './types';
import { float, index, px, uint } from '../types';
import { RES } from './GameCanvas';
import { Metrics } from './Metrics';
import { Step } from './actions/Step';
import { Animator } from '../anim/Animator';
import { TilePainter } from './TilePainter';

export class Npc implements DrawableCreature {

  positionX: index;
  positionY: index;
  direction: Dir;
  metrics: Metrics;

  shiftX    = 0;
  shiftY    = 0;
  private movement: Animator | undefined;
  private f = 1;

  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }

  constructor(public id: uint, metrics: Metrics, posX: index, posY: index) {
    this.metrics   = metrics;
    this.positionX = posX;
    this.positionY = posY;
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
        break
    }


    const p = bp.toInTile(this.positionX, this.positionY, this.shiftX, this.shiftY);

    drawLifeLine(p, this);
    const sx = Math.floor(this.f * 4) * 16;
    bp.drawTile(RES["NPC_test"], sx, sy, 16, 32, this.positionX, this.positionY, this.shiftX + QCELL, this.shiftY);
    drawName(p, this);
  }


}