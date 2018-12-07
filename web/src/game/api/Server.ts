import { Action } from '../actions/Action';
import { Step } from '../actions/Step';
import { WS_HOST } from '../../util/net';
import { FireballSpell } from '../actions/FireballSpell';


let incId = 0;

export class Server {
  // @ts-ignore
  private handler: (name: String, action: Action) => void;
  private ws: WebSocket;

  constructor() {
    this.ws           = new WebSocket(WS_HOST+'/ws');
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data))
  }

  private onRawData(data: any) {
    //console.log("Raw data", data);
    this.handler(data.action, data.data)
  }

  sendAction(action: Action) {

    console.log("Action >", action);

    if (action instanceof Step) {
      this.ws.send(JSON.stringify({
        action: "STEP", id: ++incId, data: {
          x: action.fromPosX, y: action.fromPosY, direction: action.direction, duration: action.duration
        }
      }))
    } else if (action instanceof FireballSpell) {
      this.ws.send(JSON.stringify({
        action: "SPELL", id: ++incId, type: "FIREBALL", data: {

          x: action.posX, y: action.posY, direction: action.direction, distance: action.distance, speed: action.duration
        }
      }))

    }

  }

  subOnAction(handler: (name: String, action: Action) => void) {
    this.handler = handler;

  }

}