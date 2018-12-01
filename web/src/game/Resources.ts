import { HOST } from '../util/net';

export const RESOURCES = [
  'NPC_test',
  'objects',
  'fireball_32',
  'map1',
  'character'
];


export class Resources {

  private data: { [index: string]: HTMLImageElement } & object = {};

  private load(name: string, onLoaded: () => void) {
    let img         = new Image();
    img.crossOrigin = "Anonymous";
    img.src         = `${HOST}/res/${name}.png`;
    img.onload      = () => {
      this.data[name] = img;
      onLoaded();
    };
  }

  onLoad(fun: (data: { [index: string]: HTMLImageElement }) => void) {

    RESOURCES.forEach(name => this.load(name, () => {
      if (Object.keys(this.data).length === RESOURCES.length) {
        fun(this.data);
      }
    }))

  }
}