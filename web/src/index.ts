import { Ballad } from './canvas/Ballad';
import { get } from './Module';
import { GameCanvas } from './game2/render/GameCanvas';
import './promiser/ext';

export const HOST    = "http://localhost";
export const WS_HOST = "ws://localhost";

window.onload = () => {
  let div = document.getElementById("game")!!;
  console.info(div);
  let p    = new Ballad(div);
  const gc = get(GameCanvas);
  p.start(gc);
};

if ((window as any).File && (window as any).FileReader && (window as any).FileList && (window as any).Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}
