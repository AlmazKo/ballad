import { HOST } from '../index';

const basicResources: string[] = [
  'NPC_test',
  'objects',
  'fireball_32',
  'map1',
  'character',
  'character_alien',
  'ico_fireball',
  'ico_melee',
  'ico_fireshock'
];

export class Resources {

  private data: { [index: string]: HTMLImageElement } = {};

  loadBasic(): Promise<{ [index: string]: HTMLImageElement }> {
    return Promise
      .all(basicResources.map(n => loadImage(n).do(i => this.data[n] = i)))
      .map(() => this.data)
  }
}


export function loadImage(name: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let img         = new Image();
    img.crossOrigin = "Anonymous";
    img.src         = `${HOST}/res/${name}.png`;
    img.onerror     = reject;
    img.onload      = () => {
      resolve(img)
    };
  });
}