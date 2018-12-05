import { Lands } from './Lands';
import { Server } from './api/Server';
import { MovingKeys } from './MovingKeys';
import { uint } from '../types';
import { Effect } from './Effect';
import { BasePainter } from '../draw/BasePainter';
import { Step } from './actions/Step';
import { FireballSpell } from './actions/FireballSpell';
import { Protagonist } from './Protagonist';
import { Npc } from './Npc';
import { CELL, Dir, HCELL } from './types';
import { ApiArrival } from './api/ApiArrival';
import { ApiStep } from './api/ApiStep';
import { style } from './styles';
import { Fireball } from './effects/Fireball';
import { TilePainter, toX, toY } from './TilePainter';
import { FireShockSpell } from './actions/FireShockSpell';
import { FireShock } from './effects/FireShock';
import { ApiDamage } from './api/ApiDamage';
import { ApiDeath } from './api/ApiDeath';
import { DamageEffect } from './effects/DamageEffect';
import { ApiHide } from './api/ApiHide';
import { ApiSpell } from './api/ApiSpell';

let INC: uint = 0;

export function nextId(): uint {
  return INC++;
}


export enum PlayerAction {
  FIREBALL, FIRESHOCK
}


export const DEBUG = true;

export class Game {

  private creatures = new Map<uint, Npc>();
  private effects   = [] as Array<Effect>;
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


    if (!this.tp) this.tp = new TilePainter(p);
    this.map.updateFocus(this.tp, this.proto);
    this.map.draw(p);
    this.creatures.forEach(it => {
      it.draw(time, this.tp)
    });

    this.proto.draw(time, this.tp);
    if (this.proto) this.drawFog(this.tp);

    this.effects.forEach(it => {
      it.draw(time, this.tp)
    });

    //fixme optimize?
    this.effects = this.effects.filter(b => !b.isFinished)
    if (DEBUG) this.debug(p);
  }

  private debug(bp: BasePainter) {
    const p = this.proto;

    const pX = p.getX(), pY = p.getY();
    bp.rect(pX - HCELL, pY - HCELL, CELL, CELL, {style: "red"});
    bp.text(`${p.positionX}x${p.positionY}`, pX + 1, pY + HCELL + 1, {align: 'center', font: "12px sans-serif", style: "#000"});
    bp.text(`${p.positionX}x${p.positionY}`, pX, pY + HCELL, {align: 'center', font: "12px sans-serif", style: "#fff"});

    bp.fillRect(20, 0, this.tp.width, 20, "#ffffff88");
    bp.fillRect(0, 0, 20, this.tp.height, "ffffff88");
    for (let pos = 0; pos < 100; pos++) {
      bp.text("" + pos, toX(pos) + 2, 0, style.debugText);
      bp.text("" + pos, 1, toY(pos), style.debugText);
      bp.vline(toX(pos), 0, 20, {style: "white"});
      bp.hline(0, 20, toY(pos), {style: "white"});
    }
    bp.fillRect(0, 0, 20, 20, "#ccc");
  }

  private drawFog(p: TilePainter) {
    const radius = (this.proto.viewDistance + 0.5) * CELL;
    const x      = this.proto.getX();
    const y      = this.proto.getY();
    const xL     = x - radius;
    const xR     = x + radius;
    const yU     = y - radius;
    const yD     = y + radius;

    p.fillRect(0, 0, xL, p.height, style.fog); //LEFT
    p.fillRect(xL, 0, radius + radius, yU, style.fog);// TOP
    p.fillRect(xR, 0, p.width - xR, p.height, style.fog);//RIGHT
    p.fillRect(xL, yD, radius + radius, p.height - yD, style.fog);//BOTTOM

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

      case "SPELL":
        this.onSpell(action as ApiSpell);
        break;

      case "HIDE":
        this.onHidden(action as ApiHide);
        break;

      case "DEATH":
        this.onDeath(action as ApiDeath);
        break;
    }
  }


  private onSpell(s: ApiSpell) {

    // this.effects.push()
  }

  private onDamage(d: ApiDamage) {

    if (this.proto.id === d.victimId) {
      this.proto.metrics.life -= d.amount;
    } else {
      const c = this.creatures.get(d.victimId);
      if (!c) return;
      c.metrics.life -= d.amount;

    }

    this.effects.push(new DamageEffect(d));
  }

  private onHidden(d: ApiHide) {
    this.creatures.delete(d.creatureId);
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
        this.effects.push(new Fireball(fireball, this.map));
        break;

      case PlayerAction.FIRESHOCK:
        const fireshok = new FireShockSpell(this.proto, 400, 2);
        this.server.sendAction(fireshok);
        this.effects.push(new FireShock(fireshok));
        break;

    }
    // new Fireball()
  }
}