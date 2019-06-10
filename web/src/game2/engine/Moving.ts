import { Dir } from '../constants';
import { MovingAggregator } from '../controller/MovingAggregator';
import { MovingListener } from './MovingListener';


export interface Focus {
  moving: Dir,
  sight: Dir
}

export class Moving implements MovingAggregator {

  // private currentMoving: Dir = 0;
  // private currentSight: Dir  = Dir.SOUTH;
  private _current: Focus          = {moving: 0, sight: Dir.SOUTH};
  private _next: Focus             = {moving: 0, sight: Dir.SOUTH};
  private listener: MovingListener = null!!;

  listen(listener: MovingListener) {
    this.listener = listener;
  }

  press(dir: Dir) {

    if (this._current.moving === dir) return;

    if (this._current.moving === 0) {
      this._current.moving = dir;
      this._current.sight  = dir;

      this.listener.onStartMoving(this._current);
      return
    } else {
      this._next = {moving: this._current.moving, sight: dir};
    }
  }

  release(dir: Dir) {
    if (this._current.moving === dir) {
      this._next = {moving: this._current.moving, sight: dir};
      this.listener.onStopMoving();
    }
  }

  current() {

  }

  flip() {

  }

  // toString() {
  //   return `next: ${this.currentMoving} -> ${this.currentSight}`
  // }

}
