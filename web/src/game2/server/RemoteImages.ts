import { ImageAssets } from './ImageAssets';

export class RemoteImages extends ImageAssets  {
  load(name: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img         = new Image();
      img.src         = `../resources/${name}.png`;
      img.onerror     = reject;
      img.onload      = () => {
        resolve(img)
      };
    });
  }
}
