import { Dir } from '../constants';

export class Orientation {
  requestStop = false;
  constructor(
    public moving: Dir,
    public sight: Dir,
    public shift: floatShare,
    public x: pos,
    public y: pos
  ) {

  }

  isMoving() {
    return this.moving !== 0;
  }
}
