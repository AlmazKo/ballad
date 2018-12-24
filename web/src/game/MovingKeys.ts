import { Dir } from './constants';

export class KeyQueue {
  readonly data: int[];

  constructor() {
    this.data = [0, 0, 0, 0]
  }


  add(direction: Dir): boolean {
    const q = this.data;

    let el;
    for (let i = 0; i < 4; i++) {
      el = q[i];
      if (el === 0) {
        q[i] = direction;
        return true
      } else if (el === direction) {
        return false;
      }
    }

    if (el === 0) return false;

    console.debug("MovingKeys: add, data: ", q)

    return true;
  }


  remove(direction: int): boolean {
    const q = this.data;
    switch (direction) {
      case q[0]:
        q[0] = 0;
        q[0] = q[1];
        q[1] = q[2];
        q[2] = q[3];
        break;

      case q[1]:
        q[1] = 0;
        q[1] = q[2];
        q[2] = q[3];
        break;

      case q[2]:
        q[2] = 0;
        q[2] = q[3];
        break;

      case q[3]:
        q[3] = 0;
        break;

      default:
        return false;
    }

    return true;

  }

  peek(): int {
    return this.data[0]
  }

}

export interface Orientation {
  moving: Dir,
  sight: Dir
}


export class MovingKeys {

  private currentMoving: Dir = 0;
  private currentSight: Dir  = 0;
  private _next?: Orientation;
  private queue              = new KeyQueue();


  add(direction: Dir) {
    this.currentSight  = this.currentMoving;
    this.currentMoving = direction;
    if (!this._next) {
      this._next = {moving: direction, sight: direction}
    }
  }

  remove(direction: Dir) {
    if (this.currentSight === direction) {
      this.currentSight = 0
    } else {
      this.currentMoving = this.currentSight;
      this.currentSight  = 0;
    }
  }

  /**
   * @deprecated
   */
  next(): Dir {
    const result = this.currentMoving;
    if (result !== 0) {
      this.currentMoving = this.currentSight;
      this.currentSight  = 0;
      return result;
    }

    return this.queue.peek();
  }

  next2(): Orientation | undefined {

    if (!this._next) return undefined;

    const result =  this._next;
    if (!this.currentMoving) {
      this._next = undefined;
    } else if (this._next.moving !== this.currentMoving || this._next.sight !== this.currentMoving) {
      const sight = this.currentSight ? this.currentSight : this.currentMoving;
      this._next  = {moving: this.currentMoving, sight: sight};
    } else {
      this._next = undefined;
    }

    return result;
  }

  toString() {
    return `next: ${this.currentMoving} -> ${this.currentSight}`
  }

}