import { Dir } from '../constants';


export interface Focus {
  moving: Dir,
  sight: Dir
}

export class KeyboardMoving {

  private currentMoving: Dir = 0;
  private currentSight: Dir  = 0;
  private _next?: Focus;

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

  next(): Focus | undefined {

    if (!this._next) return undefined;

    const result = this._next;
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
