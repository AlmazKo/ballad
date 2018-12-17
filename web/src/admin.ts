import { AdminCanvas } from './admin/AdminCanvas';
import { Ballad } from './canvas/Ballad';

window.onload = () => {
  let div = document.getElementById("game")!!;
  console.info(div);
  let p = new Ballad(div);
  p.start(new AdminCanvas());
};
