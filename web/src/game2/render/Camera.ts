import { Dir } from '../constants';
import { Orientation } from '../engine/Orientation';
import { CELL } from './constants';

export class Camera {
  absoluteX: px = 100;
  absoluteY: px = 100;
  target: Orientation;

  constructor(
    public offset: floatShare,
    public x: pos,
    public y: pos) {
    this.target = new Orientation(0, 0, offset, x, y)

  }

  setTarget(orientation: Orientation) {
    this.target   = orientation;
    this.target.x = 1;
  }

  toX(pos: pos): px {
    const m    = this.target.moving;
    const base = (pos - this.target.x) * CELL + this.absoluteX;

    if (m === Dir.WEST || m === Dir.EAST) {
      return base - this.target.shift * CELL;
    } else {
      return base;
    }
  }

  toY(pos: pos): px {
    const m    = this.target.moving;
    const base = (pos - this.target.y) * CELL + this.absoluteY;

    if (m === Dir.SOUTH || m === Dir.NORTH) {
      return base + this.target.shift * CELL;
    } else {
      return base;
    }
  }
}
