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

export class MovingKeys {

  private _next1: Dir = 0;
  private _next2: Dir = 0;
  private queue       = new KeyQueue();


  add(direction: Dir) {

    if (this.queue.add(direction)) {
      if (this._next1 === 0) {
        this._next1 = direction;
      } else if (this._next2 === 0) {
        this._next2 = direction;
      } else {
        console.warn(`Ignore '${direction}'`);
        return;
      }
      console.debug(`Moving: add '${direction}', data: ${this.queue.data}, next: ${this._next1} -> ${this._next2}`)
    }
  }

  remove(direction: Dir) {
    if (this.queue.remove(direction)) {
      console.debug(`Moving: remove '${direction}', data: ${this.queue.data}`)
    } else {
      console.warn(`Moving: nothing remove '${direction}', data: ${this.queue.data}`)
    }
  }

  next(): Dir {
    const result = this._next1;
    if (result !== 0) {
      this._next1 = this._next2;
      this._next2 = 0;
      return result;
    }

    return this.queue.peek();
  }

  toString() {
    return `next: ${this._next1} -> ${this._next2}`
  }

}