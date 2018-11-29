import { Action } from './actions/Action';
import { Arrival } from './actions/Arrival';
import { ViewMap } from './ViewMap';
import { Step } from './actions/Step';

export class Server {
  private handler: (action: Action) => void;
  private map: ViewMap;
  private ws: WebSocket;

  constructor(map: ViewMap) {
    this.map          = map;
    this.ws           = new WebSocket('ws://localhost')
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data))
  }

  private onRawData(data: any) {
    console.log("Raw data", data);
    switch (data.action) {
      case "ARRIVAL":
        const a = new Arrival(data.data[0], data.data[1]);
        this.map.creatures.set(a.source.id, a.source);
        this.onAction(a);
        break;

      case "STEP":
        const d        = data.data[1];
        const creature = this.map.creatures.get(d.creatureId);
        const s        = new Step(creature, d.speed, d.direction);
        this.onAction(s);
    }

  }

  sendAction(action: Action) {

    console.log("Action >", action);

    if (action instanceof Step) {
      this.ws.send(JSON.stringify({
        action: "STEP", data: {
          x: action.fromPosX, y: action.fromPosY, direction: action.direction
        }
      }))
    }

  }

  private onAction(action: Action) {
    console.log("Action <", action);
    this.handler(action);
  }

  subOnAction(handler: (action: Action) => void) {
    this.handler = handler;

  }


  simulate() {
    // const boar = new Npc(new Metrics(50, "Boar"), 15, 8);
    // this.handler(new Arrival(boar));
    //
    // function randomDir(): Dir {
    //   return Math.round(Math.random() * (40 - 37) + 37);
    // }
    //
    //
    // setInterval(() => {
    //   let dir: Dir;
    //   do {
    //     dir = randomDir();
    //   } while (!this.map.canStep([boar.positionX, boar.positionY], dir));
    //
    //   const action = new Step(boar, 300, dir);
    //   console.log("Action <", action);
    //   this.handler(action);
    //
    // }, 400)
  }

}