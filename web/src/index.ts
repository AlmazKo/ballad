import { Ballad } from './canvas/Ballad';
import { GameCanvas } from './game/GameCanvas';
import './promiser/ext';

export const HOST    = "http://localhost";
export const WS_HOST = "ws://localhost";

window.onload = () => {
  let div = document.getElementById("game")!!;
  console.info(div);
  let p = new Ballad(div);
  p.start(new GameCanvas());
};
