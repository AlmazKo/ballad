import { Painter } from '../draw/Painter';
import { Step } from './actions/Step';
import { Dir, HCELL, QCELL } from './constants';
import { Metrics } from './Metrics';
import { Orientation2 } from './Orientation';
import { style } from './styles';
import { TileDrawable } from './TileDrawable';

export interface Creature {
  id: uint;
  orientation: Orientation2;
  metrics: Metrics;
}

// export interface DrawableCreature extends TileDrawable {
//
//   // getLifeShare(): float
// }


export function drawLifeLine(p: Painter, c: DrawableCreature) {
  // const s = c.getLifeShare();
  // // if (s >= 1) return;
  //
  // const st = (s <= 0.3) ? style.dangerLifeLine : (s <= 0.75 ? style.warningLifeLine : style.goodLifeLine);
  // p.ellipse(HCELL, HCELL + QCELL, 9, 6, 0, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI * s, false, st);
  // p.text(c.metrics.life + "", HCELL, CELL + 2, style.lifeText);
}

export function drawName(bp: Painter, c: Creature) {
  bp.text(c.metrics.name, HCELL + 0.5, -1.5, style.creatureNameBg)
  bp.text(c.metrics.name, HCELL, -2, style.creatureName)
}
