import { Ballad } from './canvas/Ballad';
import { GameCanvas } from './game/layers/GameCanvas';
import './promiser/ext';

export const HOST    = "http://localhost";
export const WS_HOST = "ws://localhost";

window.onload = () => {
  let div = document.getElementById("game")!!;
  console.info(div);
  let p = new Ballad(div);
  p.start(new GameCanvas());
};



interface Array<T> {
  isEmpty: () => T;
  first: () => T;
  last: () => T;
  findStrict: (predicate: (item: T, index: number, obj: T[]) => boolean) => T;

  /**
   * Split array on two using predicate function
   * @example `const [correctArray, incorrectArray] = [1,2,3,4,5,6,7,8,9].partition((e) => e > 5);`
   * @param {(item: T) => boolean} predicate
   * @return {[T[] , T[]]}
   */
  partition: (predicate: (item: T, index?: number, obj?: T[]) => boolean) => [T[], T[]];
  groupBy: (getKey: (item: T, index?: number, obj?: T[]) => string) => { [key: string]: T[] };
  // remove: (predicate: (item: T, index: number, obj: T[]) => boolean) => Array<T>;
  // add: (item: T) => Array<T>;
  // addFirst: (item: T) => Array<T>;
  // updateItem: (item: T, predicate: (item: T) => boolean) => Array<T>;
  toDictionary: (selector: keyof T | ((item: T) => T)) => { [key: string]: T };
  // isEmpty: () => boolean;
  // contains: (item: T) => boolean;
}
