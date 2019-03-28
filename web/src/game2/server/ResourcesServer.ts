import { MapPiece } from '../../game/api/MapPiece';
import { Tiles } from '../../game/api/Tiles';
import { HOST } from '../../index';
import { ResourcesApi } from './ResourcesApi';

export class ResourcesServer implements ResourcesApi{



  getMapPiece(x: int, y: int): Promise<MapPiece> {
    return this.ajax(`/map-piece?x=${x}&y=${y}`) as Promise<MapPiece> ;
  }

  getTileSet(id: int): Promise<Tiles> {
    return this.ajax('/tile-set?id=' + id) as Promise<Tiles> ;
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
