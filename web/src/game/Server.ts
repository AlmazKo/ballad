import { Action } from './actions/Action';
import { Npc } from './Npc';
import { Metrics } from './Metrics';
import { Appear } from './actions/Appear';
import { Step } from './actions/Step';
import { Dir } from './types';
import { ViewMap } from './ViewMap';

export class Server {
  private handler: (action: Action) => void;
  private map: ViewMap;

  constructor(map: ViewMap) {
    this.map = map;
  }

  sendAction(action: Action) {

    console.log("Action >", action)
  }

  subOnAction(handler: (action: Action) => void) {
    this.handler = handler;

    this.simulate();
  }


  simulate() {
    const boar = new Npc(new Metrics(50, "Boar"), 15, 8);
    this.handler(new Appear(boar));

    function randomDir(): Dir {
      return Math.round(Math.random() * (40 - 37) + 37);
    }


    setInterval(() => {
      let dir: Dir;
      do {
        dir = randomDir();
      } while (!this.map.canStep([boar.positionX, boar.positionY], dir));

      const action = new Step(boar, 300, dir);
      console.log("Action <", action);
      this.handler(action);

    }, 400)
  }

}