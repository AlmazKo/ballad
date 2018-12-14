import { DOMHighResTimeStamp, float, index, ms, uint } from '../types';

export interface Interpolator {
  (t: number): number;
}

export interface Handler {
  /**
   * @param {number} factor Number is changed from  0 to 1  inclusive
   */
  (factor: number): void;
}

export interface ValueHandler {
  (value: number): void;
}

export const linear: Interpolator     = t => t;
export const reverse: Interpolator    = t => 1 - t;
export const accelerate: Interpolator = t => Math.cos((t + 1) * Math.PI) / 2.0 + 0.5;
export const sin: Interpolator        = t => Math.sin(2 * 3 * Math.PI * t);
const _bounce                         = (t: number) => t * t * 8.0;
export const bounce: Interpolator     = t => {
  t *= 1.1226;
  if (t < 0.3535) return _bounce(t);
  else if (t < 0.7408) return _bounce(t - 0.54719) + 0.7;
  else if (t < 0.9644) return _bounce(t - 0.8526) + 0.9;
  else return _bounce(t - 1.0435) + 0.95;
};


export interface Animated {
  run(now: DOMHighResTimeStamp): boolean;

  isFinished(): boolean;

  finish(): void;
}


export class Animator implements Animated {
  private readonly interpolator: Interpolator;
  private readonly callback: Handler;
  private readonly duration: number;
  private finished = false;
  private start    = 0;

  private lastNow = 0;

  constructor(duration: ms, callback: Handler, interpolator: Interpolator = linear) {
    this.duration     = duration;
    this.callback     = callback;
    this.interpolator = interpolator;
  }

  /**
   * @param {number} now
   * @returns {boolean} finished?
   */
  run(now: number): boolean {
    if (!this.start) this.start = now;
    this.lastNow = now;
    if (this.finished) {
      this.callback(1);
      return true;
    }

    let fraction = this.interpolator((now - this.start) / this.duration);
    if (fraction >= 1) fraction = 1;
    this.callback(fraction);
    if (fraction >= 1) {
      this.finished = true;
    }

    return this.finished;
  }

  /**
   * Finish animation
   * The Handler will be executed once sfter this call
   */
  finish() {
    this.finished = true;
    this.callback(1);
  }

  isFinished(): boolean {
    return this.finished;
  }

  reset() {
    this.start    = this.lastNow;
    this.finished = false;
    this.start    = 0;
  }
}

export class Delay implements Animated {
  private readonly duration: number;
  private finished = false;
  private start    = 0;
  private lastNow  = 0;

  constructor(duration: ms) {
    this.duration = duration;
  }

  run(now: number): boolean {
    if (!this.start) this.start = now;
    this.lastNow = now;
    this.finished = now - this.start > this.duration;
    return this.finished;
  }

  finish() {
    this.finished = true;
  }

  isFinished(): boolean {
    return this.finished;
  }

  reset() {
    this.start    = this.lastNow;
    this.finished = false;
    this.start    = 0;
  }
}

export class LoopAnimator implements Animated {
  private readonly interpolator: Interpolator;
  private readonly callback: (f: float, i: index) => boolean;
  private readonly duration: number;
  private finished = false;

  private start: DOMHighResTimeStamp = 0;
  private times: index               = 0;


  constructor(duration: ms, callback: (f: float, i: index) => boolean, interpolator: Interpolator = linear) {
    this.duration     = duration;
    this.callback     = callback;
    this.interpolator = interpolator;
  }

  /**
   * @param {number} now
   * @returns {boolean} finished?
   */
  run(now: DOMHighResTimeStamp): boolean {
    if (this.finished) return true;
    if (!this.start) this.start = now;

    let fraction = this.interpolator((now - this.start) / this.duration) - this.times;
    if (fraction >= 1) {
      this.times++;
      fraction -= 1;
    }

    this.finished = this.callback(fraction, this.times);

    return this.finished;
  }

  /**
   * interrupt animation
   */
  finish() {
    this.finished = true;
  }

  isFinished(): boolean {
    return this.finished;
  }
}

export class AnimatorsChain implements Animated {
  private readonly animators: ReadonlyArray<Animator>;
  private currentIdx: uint;
  private finished: boolean;

  constructor(...animators: Animator[]) {
    this.animators  = animators;
    this.currentIdx = 0;
    this.finished   = animators.length === 0;
  }

  run(now: DOMHighResTimeStamp): boolean {
    if (this.finished) return true;

    if (this.animators[this.currentIdx].run(now)) {
      this.currentIdx++;
      if (this.currentIdx >= this.animators.length) {
        this.finished = true;
        return true;
      }
    }

    return false;
  }

  isFinished(): boolean {
    return this.finished;
  }

  finish(): void {
    if (this.finished) return;

    this.finished = true;
    this.animators[this.currentIdx].finish();
  }

}

export class ValueAnimator extends Animator {
  constructor(duration: ms, readonly from: number, readonly to: number, callback: ValueHandler, interpolator?: Interpolator) {
    super(duration, f => {
      callback(from + f * (to - from));
    }, interpolator);
  }
}
