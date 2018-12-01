import { Ballad } from './canvas/Ballad';
import { GameCanvas } from './game/GameCanvas';

window.onload = () => {
  let div = document.getElementById("game");
  console.info(div);
  let p = new Ballad(div);
  p.start(new GameCanvas());
};
