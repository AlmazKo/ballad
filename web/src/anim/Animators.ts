import { Animated, Animator } from './Animator';

export class Animators {

  private animators: { [name: string]: Animated } = {};
  private finishCallbacks: { [name: string]: () => void } = {};

  finish(name: string) {
    if (this.animators[name]) {
      this.animators[name].finish();
      delete this.animators[name];
    }
  }

  interrupt(name: string) {
    delete this.animators[name];
    delete this.finishCallbacks[name];
  }

  interruptAll() {
    this.animators = {};
    this.finishCallbacks = {};
  }

  finishAll() {
    for (let key in this.animators) {
      this.animators[key].finish();
    }
  }

  run(time: number) {
    for (let key in this.animators) {
      if (this.animators[key].run(time)) {
        delete this.animators[key];

        const finisher = this.finishCallbacks[key];
        if (finisher) finisher();
        delete this.finishCallbacks[key];
      }
    }
  }

  has(name: string): boolean {
    return this.animators[name] != null;
  }

  set(name: string, animator: Animated, onFinish?: () => void) {
    this.animators[name] = animator;
    if (onFinish) {
      this.finishCallbacks[name] = onFinish;
    }
  }
}
