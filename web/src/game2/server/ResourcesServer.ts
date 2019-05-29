import { MapPieceRaw } from '../../game/api/MapPieceRaw';
import { HOST } from '../../index';
import { MapApi } from './MapApi';

export class ResourcesServer implements MapApi {

  getMapPiece(x: int, y: int): Promise<MapPieceRaw> {
    return this.ajax(`/map?x=${x}&y=${y}`) as Promise<MapPieceRaw>;
  }

  private ajax(url: string): Promise<object> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", HOST + url);
      xhr.onerror = () => {
        reject(url + ': request failed')
      };
      xhr.onload  = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(url + ': request failed');
        }
      };
      xhr.send();
    });
  }
}
