import { Action } from '../actions/Action';
import { Lands } from '../Lands';
import { Step } from '../actions/Step';
import { WS_HOST } from '../../util/net';
import { FireballSpell } from '../actions/FireballSpell';

export class Server {
  private handler: (name: String, action: Action) => void;
  private ws: WebSocket;

  constructor(private map: Lands) {
    this.map          = map;
    this.ws           = new WebSocket(WS_HOST);
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data))
  }

  private onRawData(data: any) {
    console.log("Raw data", data);
    this.handler(data.action, data.data)
  }

  sendAction(action: Action) {

    console.log("Action >", action);

    if (action instanceof Step) {
      this.ws.send(JSON.stringify({
        action: "STEP", data: {
          x: action.fromPosX, y: action.fromPosY, direction: action.direction
        }
      }))
    } else if (action instanceof FireballSpell) {
      this.ws.send(JSON.stringify({
        action: "SPELL", data: {
          type: "FIREBALL",
          x   : action.posX, y: action.posY, direction: action.direction
        }
      }))

    }

  }

  subOnAction(handler: (name: String, action: Action) => void) {
    this.handler = handler;

  }

}