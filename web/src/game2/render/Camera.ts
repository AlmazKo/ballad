import { CELL } from './constants';

export class Camera {
  absoluteX: px = 100;
  absoluteY: px = 100;

  constructor(
    public offset: floatShare,
    public x: pos,
    public y: pos) {

  }

  toX(pos: pos): px {
    return (pos - this.x) * CELL + this.absoluteX;
  }

  toY(pos: pos): px {
    return (pos - this.y) * CELL + this.absoluteY;
  }


}
