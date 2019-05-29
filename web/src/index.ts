import { Ballad } from './canvas/Ballad';
import { get } from './Module';
import { GameCanvas } from './game2/render/GameCanvas';
import './ext/promiser/ext';
import './ext/array/ext';

export const HOST    = "https://localhost";
export const WS_HOST = "wss://localhost";

window.onload = () => {
  let div = document.getElementById("game")!!;
  console.info(div);
  let p    = new Ballad(div);
  const gc = get(GameCanvas);
  p.start(gc);
};
