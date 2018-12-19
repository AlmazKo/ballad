import { HOST } from '../index';

const basicResources: string[] = [
  // 'NPC_test',
  // 'objects',
  // 'fireball_32',
  // 'map1',
  // 'character',
  // 'character_alien',
  // 'ico_fireball',
  // 'ico_melee',
  // 'ico_fireshock'
];

enum Loading {
  REQUESTING, FAIL
}

export class Resources {

  private data: { [index: string]: HTMLImageElement | Loading } = {};

  loadBasic(): Promise<void> {
    return Promise
      .all(basicResources.map(n => loadImage(n).do(i => this.data[n] = i)))
      .ignore()

  }

  get(name: string): HTMLImageElement | undefined {
    const data = this.data[name];

    if (data instanceof HTMLImageElement) {
      return data;
    } else {
      if (data === undefined) {
        this.data[name] = Loading.REQUESTING;
        loadImage(name)
          .then(i => this.data[name] = i)
          .catch(() => this.data[name] = Loading.FAIL)
      }
      return undefined;
    }
  }
}

function loadImage(name: string): Promise<HTMLImageElement> {
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