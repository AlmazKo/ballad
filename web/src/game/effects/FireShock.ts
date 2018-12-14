import { Effect } from '../Effect';
import { float, index, px, uint } from '../../types';
import { LoopAnimator } from '../../anim/Animator';
import { CELL, QCELL } from '../types';
import { RES } from '../GameCanvas';
import { TilePainter } from '../TilePainter';
import { FireShockSpell } from '../actions/FireShockSpell';

export class FireShock implements Effect {
  private posX: index;
  private posY: index;
  private shift: px = 0;
  private anim: LoopAnimator;
  isFinished        = false;

  private f: float = 0;
  readonly id: uint;

  constructor(spec: FireShockSpell) {

    this.id   = spec.id;
    this.posX = spec.posX;
    this.posY = spec.posY;
    this.anim = new LoopAnimator(spec.duration, (f, i) => {
        this.f = f;
        if (i >= spec.distance) {
          this.isFinished = true;
          return true;
        } else {
          this.shift = (i + f) * CELL;
          return false;
        }
      }
    );
  }

  draw(time: DOMHighResTimeStamp, tp: TilePainter) {

    this.anim.run(time);

    const fire1    = RES["objects"];
    const size: px = 16;
    const sy: px   = 48;
    const sx: px   = 64 + Math.floor(this.f * 6) * size;
    const s: px    = this.shift;
    const posX     = this.posX;
    const posY     = this.posY;

    tp.drawTile(fire1, sx, sy, size, size, posX - 1, posY, QCELL, s);
    tp.drawTile(fire1, sx, sy, size, size, posX, posY, QCELL, s);
    tp.drawTile(fire1, sx, sy, size, size, posX + 1, posY, QCELL, s);

    tp.drawTile(fire1, sx, sy, size, size, posX - 1, posY, QCELL, -s);
    tp.drawTile(fire1, sx, sy, size, size, posX, posY, QCELL, -s);
    tp.drawTile(fire1, sx, sy, size, size, posX + 1, posY, QCELL, -s);


    tp.drawTile(fire1, sx, sy, size, size, posX, posY - 1, QCELL + s, QCELL);
    tp.drawTile(fire1, sx, sy, size, size, posX, posY, QCELL + s, QCELL);
    tp.drawTile(fire1, sx, sy, size, size, posX, posY + 1, QCELL + s, QCELL);

    tp.drawTile(fire1, sx, sy, size, size, posX, posY - 1, QCELL - s, QCELL);
    tp.drawTile(fire1, sx, sy, size, size, posX, posY, QCELL - s, QCELL);
    tp.drawTile(fire1, sx, sy, size, size, posX, posY + 1, QCELL - s, QCELL);


  }


  stop(): void {
    this.anim.finish();
    this.isFinished = true;
  }
}