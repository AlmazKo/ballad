import { CELL } from './constants';

export class Camera {

  constructor(
    public offset: floatShare,
    public x: pos,
    public y: pos) {

  }

  toX(pos: pos): px {
    return CELL * pos - this.x;//fixme
  }

  toY(pos: pos): px {
    return CELL * pos - this.y;//fixme
  }


}
