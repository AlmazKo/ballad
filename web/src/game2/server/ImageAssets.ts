import { Images } from '../Images';

const basicResources: string[] = [
  // todo characters & spell images
];

enum Loading {
  REQUESTING, FAIL
}


export class ImageAssets implements Images {

  private data: { [index: string]: HTMLImageElement | Loading } = {};

  constructor(private readonly host: string) {

  }
  loadBasic(): Promise<void> {
    return Promise
      .all(basicResources.map(n => this.load(n).do(i => this.data[n] = i)))
      .ignore()
  }

  get(name: string): HTMLImageElement | undefined {
    const data = this.data[name];

    if (data instanceof HTMLImageElement) {
      return data;
    } else {
      if (data === undefined) {
        this.data[name] = Loading.REQUESTING;
        this.load(name)
          .then(i => this.data[name] = i)
          .catch(() => this.data[name] = Loading.FAIL)
      }
      return undefined;
    }
  }

  load(name: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img         = new Image();
      img.crossOrigin = "Anonymous";
      img.src         = `${this.host}/res/${name}.png`;
      img.onerror     = reject;
      img.onload      = () => {
        resolve(img)
      };
    });
  }
}


