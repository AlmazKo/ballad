import { Lands } from './Lands';
import { Server } from './api/Server';
import { MovingKeys } from './MovingKeys';
import { uint } from '../types';
import { Spell } from './Spell';
import { BasePainter } from '../draw/BasePainter';
import { Step } from './actions/Step';
import { FireballSpell } from './actions/FireballSpell';
import { Protagonist } from './Protagonist';
import { Npc } from './Npc';
import { CELL, Dir } from './types';
import { ApiArrival } from './api/ApiArrival';
import { ApiStep } from './api/ApiStep';
import { Metrics } from './Metrics';
import { style } from './styles';
import { Fireball } from './effects/Fireball';

let INC: uint = 0;

export function nextId(): uint {
  return INC++;
}


export enum PlayerAction {
  FIREBALL, FIRESHOCK
}


export class Game {

  private creatures = new Map<uint, Npc>();
  private spells    = [] as Array<Spell>;
  private server: Server;
  private proto: Protagonist | undefined;

  constructor(private map: Lands, private moving: MovingKeys) {
    this.server = new Server(map);
    this.server.subOnAction((name, action) => this.onServerAction(name, action));
  }

  onFrame(time: DOMHighResTimeStamp, p: BasePainter) {

    this.map.draw(p, 1, 1);
    this.creatures.forEach(it => {
      it.draw(time, p)
    });

    if (this.proto) this.proto.draw(time, p);
    if (this.proto) this.drawFog(p);

    this.spells.forEach(it => {
      it.draw(time, p)
    });


    //fixme optimize?
    this.spells = this.spells.filter(b => !b.isFinished)
  }

  private drawFog(p: BasePainter) {


    const areaSize = CELL * 8;

    const xL = this.proto.getX() - areaSize;
    const xR = this.proto.getX() + areaSize + CELL;
    const yU = this.proto.getY() - areaSize;
    const yD = this.proto.getY() + areaSize + CELL;

    p.fillRect(0, 0, xL, p.ctx.canvas.height, style.fog); //LEFT
    p.fillRect(xL, 0, p.ctx.canvas.width - xL, yU, style.fog);// TOP
    p.fillRect(xR, yU, p.ctx.canvas.width - xR, p.ctx.canvas.height, style.fog);//RIGHT
    p.fillRect(xL, yD, areaSize + areaSize + +CELL, p.ctx.canvas.height - yD, style.fog);//BOTTOM

  }


  onServerAction(type: String, action: any) {
    let a;

    switch (type) {

      case "PROTAGONIST_ARRIVAL":
        a          = action as ApiArrival;
        this.proto = new Protagonist(a.creature, this.moving, this.map, this.server);
        break;

      case "ARRIVAL":
        a       = action as ApiArrival;
        const m = new Metrics(a.creature.metrics);
        const n = new Npc(a.creature.id, m, a.creature.x, a.creature.y);
        this.creatures.set(a.creature.id, n);
        break;

      case "STEP":
        a       = action as ApiStep;
        const c = this.creatures.get(a.creatureId);
        if (!c) return;

        c.onStep(new Step(c, a.duration, a.direction));
        break;
    }
  }

  onStep(dir: Dir) {

    this.proto.step(dir)
  }

  sendAction(action: PlayerAction) {

    switch (action) {
      case PlayerAction.FIREBALL:
        const fireball = new FireballSpell(this.proto, 200, 12);
        this.server.sendAction(fireball);
        this.spells.push(new Fireball(fireball, this.map));
        break;
      case PlayerAction.FIRESHOCK:
        break;

    }
   // new Fireball()
  }
}