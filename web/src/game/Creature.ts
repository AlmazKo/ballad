import { float, index, px } from '../types';
import { Dir, HCELL } from './types';
import { BasePainter } from '../draw/BasePainter';
import { style } from './styles';
import { Metrics } from './Metrics';


export interface Creature {
  positionX: index;
  positionY: index;
  direction: Dir;
  metrics: Metrics;

  getLifeShare(): float;

  getX(): px;

  getY(): px;
}


export function drawLifeLine(bp: BasePainter, c: Creature) {
  const s = c.getLifeShare();
  // if (s >= 1) return;

  bp.ctx.beginPath();
  bp.ctx.ellipse(c.getX() + HCELL, c.getY() + HCELL + 8, 9, 6, 0, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI * s);
  const st = (s <= 0.3) ? style.dangerLifeLine : (s <= 0.75 ? style.warningLifeLine : style.goodLifeLine);
  bp.stroke(st);
  bp.ctx.stroke();
  // bp.text(c.metrics.life + "", c.getX() + HCELL, c.getY() + CELL + 2, style.lifeText)
}

export function drawName(bp: BasePainter, c: Creature) {
  bp.text(c.metrics.name, c.getX() + HCELL, c.getY() - 2, style.creatureName)
}