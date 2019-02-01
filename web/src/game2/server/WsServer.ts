import { Action } from '../../game/actions/Action';
import { Package } from '../../game/actions/Package';
import { MapPiece } from '../../game/api/MapPiece';
import { Tiles } from '../../game/api/Tiles';
import { HOST } from '../../index';
import { Api } from './Api';


export class WsServer implements Api {
  private handler: ((msg: Package) => void) | undefined;
  private ws: WebSocket;

  private prematurePackages: Package[] = [];

  constructor(url: string) {
    this.ws           = new WebSocket(url);
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data))
  }

  private onRawData(data: Package) {

    if (this.handler) {
      this.handler(data)
    } else {
      this.prematurePackages.push(data)
    }
  }

  listen(handler: (msg: Package) => void) {
    this.handler = handler;

    //todo: may be make a small delay?
    this.prematurePackages.forEach(m => this.handler!!(m));
    this.prematurePackages = []
  }

  sendAction(action: Action) {

    console.log("Action >", action);


    // if (action instanceof Step) {
    //   this.ws.send(JSON.stringify({
    //     action: "STEP", id: action.id, data: {
    //       x: action.fromPosX, y: action.fromPosY, direction: action.direction, duration: action.duration
    //     }
    //   }))
    // } else if (action instanceof FireballSpell) {
    //   this.ws.send(JSON.stringify({
    //     action: "SPELL", id: action.id, type: "FIREBALL", data: {
    //
    //       x: action.posX, y: action.posY, direction: action.direction, distance: action.distance, speed: action.duration
    //     }
    //   }))
    //
    // }

  }



  ajax(url: string): Promise<object> {
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

  getMapPiece(x: int, y: int): Promise<MapPiece> {
    return this.ajax(`/map-piece?x=${x}&y=${y}`) as Promise<MapPiece> ;
  }

  getTileSet(id: int): Promise<Tiles> {
    return this.ajax('/tile-set?id=' + id) as Promise<Tiles> ;
  }
}
