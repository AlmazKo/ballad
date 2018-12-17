import { HOST } from '../index';

const BASIC_RESOURCES: string[] = [
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
      .all(BASIC_RESOURCES.map(n =>
          loadImage(n)
            .then(i => this.data[n] = i)
        )
      )
      .then(_ => this.data)
  }
}


export function loadImage(name: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {

    let img         = new Image();
    img.crossOrigin = "Anonymous";
    img.src         = `${HOST}/res/${name}.png`;
    img.onload      = () => {
      resolve(img)
    };
  });
}