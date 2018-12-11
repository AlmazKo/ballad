import { Lands } from './Lands';
import { Server } from './api/Server';
import { MovingKeys } from './MovingKeys';
import { BasePainter } from '../draw/BasePainter';
import { Protagonist } from './Protagonist';
import { CELL, Dir, HCELL } from './types';
import { ApiArrival } from './api/ApiArrival';
import { style } from './styles';
import { TilePainter, toX, toY } from './TilePainter';
import { Session } from './Session';
import { Action } from './actions/Action';

export enum PlayerAction {
  FIREBALL, FIRESHOCK, STEP
}


export const DEBUG = true;

export class Game {

  private server?: Server;
  // @ts-ignore
  private tp: TilePainter;
  // @ts-ignore
  private proto: Protagonist;
  private session: Session | null     = null;

  constructor(private map: Lands, private moving: MovingKeys) {

  }

  onFrame(time: DOMHighResTimeStamp, p: BasePainter) {
    if (!this.tp) this.tp = new TilePainter(p);
    if (this.session) {
      this.session.draw(time, p);
      if (DEBUG) this.debug(p);
    }


  if(!this.server){
      this.server = new Server();
      this.server.subOnAction((name, action) => this.onServerAction(name, action));
    }
  }

  private debug(bp: BasePainter) {
    const p = this.proto;

    const pX = p.getX(), pY = p.getY();
    bp.rect(pX - HCELL, pY - HCELL, CELL, CELL, {style: "red"});
    bp.text(`${p.positionX};${p.positionY}`, pX + 1, pY + HCELL + 1, {align: 'center', font: "12px sans-serif", style: "#000"});
    bp.text(`${p.positionX};${p.positionY}`, pX, pY + HCELL, {align: 'center', font: "12px sans-serif", style: "#fff"});

    bp.fillRect(20, 0, this.tp.width, 20, "#ffffff88");
    bp.fillRect(0, 0, 20, this.tp.height, "ffffff88");
    for (let pos = -48; pos < 100; pos++) {
      bp.text("" + pos, toX(pos) + 2, 0, style.debugText);
      bp.text("" + pos, 1, toY(pos), style.debugText);
      bp.vline(toX(pos), 0, 20, {style: "white"});
      bp.hline(0, 20, toY(pos), {style: "white"});
    }
    bp.fillRect(0, 0, 20, 20, "#ccc");
  }

  onServerAction(type: String, action: any) {
    let a;

    switch (type) {
      case "PROTAGONIST_ARRIVAL":
        a          = action as ApiArrival;
        this.proto = new Protagonist(a.creature, this.moving, this.map, this);

        this.session = new Session(this.server!!, this.proto, this.map, this.tp);
        break;

      default:
        if (this.session) this.session.onServerAction(type, action)

    }
  }

  sendAction(action: PlayerAction): Action {
    if (this.session) return this.session.sendAction(action);

    return null!!;
  }

  onStep(dir: Dir) {
    this.proto.step(dir)
  }
}