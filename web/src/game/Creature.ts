import { float, index, px, uint } from '../types';
import { Dir, HCELL } from './types';
import { BasePainter } from '../draw/BasePainter';
import { style } from './styles';
import { Metrics } from './Metrics';
import { Step } from './actions/Step';
import { Drawable } from './Drawable';


export interface Creature {
  id: uint;
  positionX: index;
  positionY: index;
  direction: Dir;
  metrics: Metrics;

  onStep(step: Step): void;
}

export interface DrawableCreature extends Creature, Drawable {

  getX(): px;

  getY(): px;

  getLifeShare(): float

}


export function drawLifeLine(bp: BasePainter, c: DrawableCreature) {
  const s = c.getLifeShare();
  // if (s >= 1) return;

  bp.ctx.beginPath();
  bp.ctx.ellipse(c.getX() + HCELL, c.getY() + HCELL + 8, 9, 6, 0, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI * s);
  const st = (s <= 0.3) ? style.dangerLifeLine : (s <= 0.75 ? style.warningLifeLine : style.goodLifeLine);
  bp.stroke(st);
  bp.ctx.stroke();
  // bp.text(c.metrics.life + "", c.getX() + HCELL, c.getY() + CELL + 2, style.lifeText)
}

export function drawName(bp: BasePainter, c: DrawableCreature) {
  bp.text(c.metrics.name, c.getX() + HCELL, c.getY() - 2, style.creatureName)
}