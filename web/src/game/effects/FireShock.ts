import { Spell } from '../Spell';
import { float, index, px } from '../../types';
import { LoopAnimator } from '../../anim/Animator';
import { BasePainter } from '../../draw/BasePainter';
import { CELL, QCELL } from '../types';
import { RES } from '../..';

export class FireShock implements Spell {
  private posX: index;
  private posY: index;
  private shift: px = 0;
  private anim: LoopAnimator;
  isFinished        = false;

  private f: float;

  constructor(posX: index, posY: index) {
    this.posX = posX;
    this.posY = posY;
    this.anim = new LoopAnimator(400, (f, i) => {
        this.f = f;
        if (i >= 2) {
          this.anim.finish();
          this.isFinished = true;
        } else {
          this.shift = (i + f) * CELL;
        }
      }
    );
  }

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {

    this.anim.run(time);

    const fire1 = RES["objects"];

    let x: px = this.posX * CELL + QCELL,
        y: px = this.posY * CELL + QCELL;

    const coefX = Math.floor(this.f / (1 / 6.0));
    const sx    = 64 + coefX * 16;


    const s = this.shift, c = bp.ctx;

    c.drawImage(fire1, sx, 48, 16, 16, x + s, y - CELL, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x + s, y, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x + s, y + CELL, 16, 16);

    c.drawImage(fire1, sx, 48, 16, 16, x - s, y - CELL, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x - s, y, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x - s, y + CELL, 16, 16);

    c.drawImage(fire1, sx, 48, 16, 16, x + CELL, y + s, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x, y + s, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x - CELL, y + s, 16, 16);

    c.drawImage(fire1, sx, 48, 16, 16, x + CELL, y - s, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x, y - s, 16, 16);
    c.drawImage(fire1, sx, 48, 16, 16, x - CELL, y - s, 16, 16);
  }

}