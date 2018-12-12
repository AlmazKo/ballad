import { Protagonist } from './Protagonist';
import { Server } from './api/Server';
import { BasePainter } from '../draw/BasePainter';
import { TilePainter } from './TilePainter';
import { PlayerAction } from './Game';
import { Lands } from './Lands';
import { ApiArrival } from './api/ApiArrival';
import { Npc } from './Npc';
import { ApiStep } from './api/ApiStep';
import { Step } from './actions/Step';
import { ApiDamage } from './api/ApiDamage';
import { ApiSpell } from './api/ApiSpell';
import { ApiHide } from './api/ApiHide';
import { ApiDeath } from './api/ApiDeath';
import { DamageEffect } from './effects/DamageEffect';
import { CELL, Dir } from './types';
import { FireballSpell } from './actions/FireballSpell';
import { Fireball } from './effects/Fireball';
import { FireShockSpell } from './actions/FireShockSpell';
import { FireShock } from './effects/FireShock';
import { style } from './styles';
import { Drawable } from './Drawable';
import { tsm, uint } from '../types';
import { Action } from './actions/Action';
import { ApiReSpawn } from './api/ApiReSpawn';


let INC: uint = 0;

export class Session implements Drawable {
  private lastSpellTime: tsm = 0;

  constructor(
    private server: Server,
    private proto: Protagonist,
    private map: Lands,
    private tp: TilePainter
  ) {
    console.log(tp)
  }

  draw(time: DOMHighResTimeStamp, p: BasePainter) {


    if (this.proto) this.map.updateFocus(this.tp, this.proto);
    this.map.draw(p);
    this.map.creatures.forEach(it => {
      it.draw(time, this.tp)
    });

    this.proto.draw(time, this.tp);
    this.drawFog(this.tp);

    this.map.effects.forEach(it => {
      it.draw(time, this.tp)
    });

    //fixme optimize?
    this.map.effects = this.map.effects.filter(b => !b.isFinished)
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

      case "ARRIVAL":
        a = action as ApiArrival;
        if (a.creature.id !== this.proto.id) {
          const n = new Npc(a.creature);
          this.map.creatures.set(a.creature.id, n);
        }

        break;
      case "RESPAWN":
        a = action as ApiReSpawn;
        if (a.creature.id === this.proto.id) {
          this.proto.positionX    = a.creature.x;
          this.proto.positionY    = a.creature.y;
          this.proto.metrics.life = a.creature.metrics.life;
        }

        break;

      case "STEP":
        a       = action as ApiStep;
        const c = this.map.creatures.get(a.creatureId);
        if (!c) return;
        const s    = new Step(this.nextId(), c, a.duration, a.direction);
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


  private onDamage(d: ApiDamage) {


    if (this.proto.id === d.victimId) {
      this.proto.metrics.life -= d.amount;
    } else {
      const c = this.map.creatures.get(d.victimId);
      if (!c) return;
      c.metrics.life -= d.amount;
    }

    this.map.effects.push(new DamageEffect(d));

    if (d.spellId > 0) {
      const ef = this.map.effects.find(e => e.id == d.spellId);
      if (ef) ef.stop();
      this.map.effects = this.map.effects.filter(e => !e.isFinished);
    }

  }


  private onSpell(action1: ApiSpell) {

  }

  private onHidden(d: ApiHide) {
    this.map.creatures.delete(d.creatureId);
  }

  private onDeath(d: ApiDeath) {
    this.map.creatures.delete(d.victimId);
  }

  onStep(dir: Dir) {

    this.proto.step(dir)
  }

  sendAction(action: PlayerAction): Action | undefined {

    const time = Date.now();
    switch (action) {
      case PlayerAction.FIREBALL:
        if (time - this.lastSpellTime < 1000) return undefined;
        this.lastSpellTime = time;
        const fireball     = new FireballSpell(time, this.nextId(), this.proto, 100, 10);

        this.server.sendAction(fireball);
        this.map.effects.push(new Fireball(fireball, this.map));
        return fireball;

      case PlayerAction.FIRESHOCK:
        if (time - this.lastSpellTime < 1000) return undefined;
        this.lastSpellTime = time;
        const fireshok     = new FireShockSpell(time, this.nextId(), this.proto, 400, 2);
        this.server.sendAction(fireshok);
        const act = new FireShock(fireshok);
        this.map.effects.push(act);
        return fireshok;

      case PlayerAction.STEP:
        const step = new Step(this.nextId(), this.proto, 300);
        this.server.sendAction(step);
        return step;

    }
    return null!!;
  }


  nextId(): uint {
    return (INC++) + 2147483647 * this.proto.id;
  }

}