import { HotKey } from '../../game/Slot';
import { Traits, TraitStep } from '../../game/Trait';
import { MovingListener } from '../engine/MovingListener';
import { MovingAggregator } from './MovingAggregator';

export class Key {
  constructor(
    public readonly code: uint,
    public readonly name: string) {
  }

  toString() {
    return name;
  }
}


export const BTN_1 = new Key(49, "1");
export const BTN_2 = new Key(50, "2");
export const BTN_3 = new Key(51, "3");

export const BTN_LEFT  = new Key(37, "◁");
export const BTN_RIGHT = new Key(39, "▷");
export const BTN_UP    = new Key(38, "△");
export const BTN_DOWN  = new Key(40, "▽");

export const MovingButtons = [BTN_LEFT.code, BTN_RIGHT.code, BTN_UP.code, BTN_DOWN.code];

export const hotKeys = new Map<Key, HotKey>();
hotKeys.set(BTN_UP, new HotKey(BTN_UP, Traits.stepNorth));
hotKeys.set(BTN_DOWN, new HotKey(BTN_DOWN, Traits.stepSouth));
hotKeys.set(BTN_LEFT, new HotKey(BTN_LEFT, Traits.stepWest));
hotKeys.set(BTN_RIGHT, new HotKey(BTN_RIGHT, Traits.stepEast));

hotKeys.set(BTN_1, new HotKey(BTN_1, Traits.melee));
hotKeys.set(BTN_2, new HotKey(BTN_2, Traits.fireball));
hotKeys.set(BTN_3, new HotKey(BTN_3, Traits.fireshock));


export const Buttons: { [index: number]: Key } = {
  49: BTN_1,
  50: BTN_2,
  51: BTN_3,
  37: BTN_LEFT,
  38: BTN_UP,
  39: BTN_RIGHT,
  40: BTN_DOWN
};


export class Keyboard {

  constructor(
    private readonly moving: MovingAggregator,
    private readonly listener: MovingListener
  ) {
    // window.addEventListener('keypress', e => this.onKeypress(e));
    window.addEventListener('keydown', e => this.onKeydown(e));
    window.addEventListener('keyup', e => this.onKeyup(e));
  }

  // private onKeypress(e: KeyboardEvent) {
  //   console.log('PRESS', e.key, e.keyCode)
  // }


  private onKeydown(e: KeyboardEvent) {
    const btn = Buttons[e.keyCode];
    if (btn == undefined) return;
    // console.log('DOWN ', e.key, e.keyCode);

    // if (MovingButtons.contains(btn.code)) {

    const t = hotKeys.get(btn)!!.trait;
    if (t instanceof TraitStep) {
      this.moving.press(t.dir);
    }
    //fixme return the code
    // this.moving.press(btn.code);

  }

  private onKeyup(e: KeyboardEvent) {

    const btn = Buttons[e.keyCode];
    if (btn == undefined) return;
    console.log('onKeyup   ', e.keyCode, btn);

    const t = hotKeys.get(btn)!!.trait;
    if (t instanceof TraitStep) {
      this.moving.release(t.dir);
    }
  }

  private onChanged() {
    // const f = this.moving.next();
    // if (f !== undefined) {
    //   console.log('Focus: ', f);
    //   this.listener.onStartMoving(f);
    // }
  }


}
