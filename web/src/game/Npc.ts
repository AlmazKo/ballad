import { Creature, drawLifeLine, drawName } from './Creature';
import { Drawable } from './Drawable';
import { BasePainter } from '../draw/BasePainter';
import { CELL, Dir, QCELL } from './types';
import { float, index, px, uint } from '../types';
import { RES } from '../index';
import { Metrics } from './Metrics';
import { Step } from './actions/Step';
import { Animator } from '../anim/Animator';

export class Npc implements Creature, Drawable {

  id: uint  = 2; //fixme hardcoded
  positionX: index;
  positionY: index;
  direction = Dir.DOWN;
  metrics: Metrics;

  private shiftX = 0;
  private shiftY = 0;
  private movement: Animator | undefined;

  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }

  getX(): px {
    return this.positionX * CELL + this.shiftX;
  }

  getY(): px {
    return this.positionY * CELL + this.shiftY;
  }



  constructor(metrics: Metrics, posX: index, posY: index) {
    this.metrics   = metrics;
    this.positionX = posX;
    this.positionY = posY;
  }


  onStep(step: Step) {
    this.direction = step.direction;

    this.movement = new Animator(step.duration, f => {

      if (f >= 1) {
        switch (step.direction) {
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
      } else {
        if (step.direction === Dir.LEFT) this.shiftX = -f * CELL;
        if (step.direction === Dir.RIGHT) this.shiftX = f * CELL;
        if (step.direction === Dir.UP) this.shiftY = -f * CELL;
        if (step.direction === Dir.DOWN) this.shiftY = f * CELL;
      }


    });

  }

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {

    if (this.movement && !this.movement.isFinished()) this.movement.run(time);

    let x: px = this.positionX * CELL + this.shiftX,
        y: px = this.positionY * CELL + this.shiftY;

    let sy: px;

    switch (this.direction) {
      case Dir.UP:
        sy = 64;
        break;

      case Dir.DOWN:
        sy = 0;
        break;

      case Dir.RIGHT:
        sy = 32;
        break;

      case Dir.LEFT:
        sy = 96;
        break
    }

    drawLifeLine(bp, this);
    const img = RES["NPC_test"];
    bp.ctx.drawImage(img, 0, sy, 16, 32, x + QCELL, y, 16, 32);
    drawName(bp, this);
  }


}