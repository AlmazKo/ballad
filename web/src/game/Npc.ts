import { Creature, drawLifeLine, drawName } from './Creature';
import { Drawable } from './Drawable';
import { BasePainter } from '../draw/BasePainter';
import { CELL, Dir, QCELL } from './types';
import { float, index, px } from '../types';
import { RES } from '../index';
import { Metrics } from './Metrics';

export class Npc implements Creature, Drawable {
  positionX: index;
  positionY: index;
  direction = Dir.DOWN;


  metrics: Metrics;

  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }


  getX(): px {
    return this.positionX * CELL;
  }

  getY(): px {
    return this.positionY * CELL;
  }


  constructor(metrics: Metrics, posX: index, posY: index) {
    this.metrics   = metrics;
    this.positionX = posX;
    this.positionY = posY;
  }

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {

    let x: px = this.positionX * CELL,
        y: px = this.positionY * CELL;

    let s: float, sx: px, sy: px;

    switch (this.direction) {
      case Dir.UP:
        sy = 64;
        // s  = -this.shiftY / CELL;
        break;

      case Dir.DOWN:
        sy = 0;
        // s  = this.shiftY / CELL;
        break;

      case Dir.RIGHT:
        sy = 32;
        // s  = this.shiftX / CELL;
        break;

      case Dir.LEFT:
        sy = 96;
        // s  = -this.shiftX / CELL;
        break
    }

    // if (s < 0.25) {
    //   sx = 0;
    // } else if (s < 0.5) {
    //   sx = 16;
    // } else if (s < 0.75) {
    //   sx = 32;
    // } else {
    //   sx = 48;
    // }

    drawLifeLine(bp, this);
    const img = RES["NPC_test"];
    bp.ctx.drawImage(img, 0, sy, 16, 32, x + QCELL, y, 16, 32);
    drawName(bp, this);
  }


}