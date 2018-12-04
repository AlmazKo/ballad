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
import { TilePainter } from './TilePainter';
import { FireShockSpell } from './actions/FireShockSpell';
import { FireShock } from './effects/FireShock';
import { ApiDamage } from './api/ApiDamage';
import { ApiDeath } from './api/ApiDeath';

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
  // @ts-ignore
  private tp: TilePainter;
  // @ts-ignore
  private proto: Protagonist;

  constructor(private map: Lands, private moving: MovingKeys) {
    this.server = new Server(map);
    this.server.subOnAction((name, action) => this.onServerAction(name, action));
  }

  onFrame(time: DOMHighResTimeStamp, p: BasePainter) {


    if (!this.proto) return;


    this.map.updateFocus(this.proto);
    if (!this.tp) this.tp = new TilePainter(p);
    this.map.draw(p);
    this.creatures.forEach(it => {
      it.draw(time, this.tp)
    });

    this.proto.draw(time, this.tp);
    if (this.proto) this.drawFog(this.tp);

    this.spells.forEach(it => {
      it.draw(time, this.tp)
    });

    //fixme optimize?
    this.spells = this.spells.filter(b => !b.isFinished)
  }

  private drawFog(p: TilePainter) {
    const readius = 7.5 * CELL;
    const x       = this.proto.getX();
    const y       = this.proto.getY();
    const xL      = x - readius;
    const xR      = x + readius;
    const yU      = y - readius;
    const yD      = y + readius;

    p.fillRect(0, 0, xL, p.height, style.fog); //LEFT
    p.fillRect(xL, 0, readius + readius, yU, style.fog);// TOP
    p.fillRect(xR, 0, p.width - xR, p.height, style.fog);//RIGHT
    p.fillRect(xL, yD, readius + readius, p.height - yD, style.fog);//BOTTOM

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
        const n = new Npc(a.creature);
        this.creatures.set(a.creature.id, n);
        break;

      case "STEP":
        a       = action as ApiStep;
        const c = this.creatures.get(a.creatureId);
        if (!c) return;
        const s    = new Step(c, a.duration, a.direction);
        s.fromPosX = a.fromX;
        s.fromPosY = a.fromY;

        c.onStep(s);
        break;

      case "DAMAGE":
        this.onDamage(action as ApiDamage);
        break;

      case "DEATH":
        this.onDeath(action as ApiDeath);
        break;
    }
  }


  private onDamage(d: ApiDamage) {

    if (this.proto.id === d.victimId) {
      this.proto.metrics.life -= d.amount;
    } else {
      const c = this.creatures.get(d.victimId);
      if (!c) return;
      c.metrics.life -= d.amount;

    }
  }

  private onDeath(d: ApiDeath) {
    this.creatures.delete(d.victimId);
  }

  onStep(dir: Dir) {

    this.proto.step(dir)
  }

  sendAction(action: PlayerAction) {

    switch (action) {
      case PlayerAction.FIREBALL:
        const fireball = new FireballSpell(this.proto, 200, 8);
        this.server.sendAction(fireball);
        this.spells.push(new Fireball(fireball, this.map));
        break;

      case PlayerAction.FIRESHOCK:
        const fireshok = new FireShockSpell(this.proto, 400, 2);
        this.server.sendAction(fireshok);
        this.spells.push(new FireShock(fireshok));
        break;

    }
    // new Fireball()
  }
}