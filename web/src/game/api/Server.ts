import { Action } from '../actions/Action';
import { Step } from '../actions/Step';
import { WS_HOST } from '../../util/net';
import { FireballSpell } from '../actions/FireballSpell';
import { ApiArrival } from './ApiArrival';
import { uint } from '../../types';


let incId = 0;

export class Server {
  // @ts-ignore
  private handler: (name: String, action: Action) => void;
  private ws: WebSocket;
  private playerId: uint = 0;

  constructor() {
    this.ws           = new WebSocket(WS_HOST + '/ws');
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data))
  }

  private onRawData(data: any) {
    //console.log("Raw data", data);
    if (data.action === 'PROTAGONIST_ARRIVAL') {
      this.playerId = (data.data as ApiArrival).creature.id
    }
    this.handler(data.action, data.data)
  }

  sendAction(action: Action) {

    console.log("Action >", action);


    if (action instanceof Step) {
      this.ws.send(JSON.stringify({
        action: "STEP", id: action.id, data: {
          x: action.fromPosX, y: action.fromPosY, direction: action.direction, duration: action.duration
        }
      }))
    } else if (action instanceof FireballSpell) {
      this.ws.send(JSON.stringify({
        action: "SPELL", id: action.id, type: "FIREBALL", data: {

          x: action.posX, y: action.posY, direction: action.direction, distance: action.distance, speed: action.duration
        }
      }))

    }

  }

  subOnAction(handler: (name: String, action: Action) => void) {
    this.handler = handler;

  }

}