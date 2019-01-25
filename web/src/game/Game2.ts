import { Animator } from '../anim/Animator';
import { Animators } from '../anim/Animators';
import { BasePainter } from '../draw/BasePainter';
import { ApiMessage } from './actions/ApiMessage';
import { Step } from './actions/Step';
import { ApiArrival } from './api/ApiArrival';
import { Server } from './api/Server';
import { Dir } from './constants';
import { Controller } from './Controller';
import { Creature } from './Creature';
import { Drawable } from './Drawable';
import { Effects } from './Effects';
import { Lands } from './Lands';
import { MovingKeys } from './MovingKeys';
import { TilePainter } from './TilePainter';
import { Trait } from './Trait';


export const DEBUG = true;

export class Game2 implements Drawable {

  private server?: Server;
  // @ts-ignore
  private tp: TilePainter;
  // @ts-ignore
  private proto: Protagonist;
  private session: Controller | null = null;
  private animators                  = new Animators();
  private coolDownFraction           = 1;
  private effects                    = new Effects();
  private lastRequestedAction?: Trait;
  private slotAnimatedFraction       = 0;

  constructor(private map: Lands, private moving: MovingKeys) {

  }

  draw(time: DOMHighResTimeStamp, p: BasePainter) {
    if (!this.tp) this.tp = new TilePainter(p);
  //   this.animators.run(time);
  //   if (this.session) {
  //
  //     if (!this.proto.orientation.moving) {
  //       const nextOrientation = this.moving.next2();
  //       if (nextOrientation) {
  //         this.session.sendOrientation(nextOrientation)
  //       }
  //     }
  //
  //
  //     this.session.draw(time, p);
  //     if (DEBUG) this.debug(p);
  //
  //     this.effects.draw(time, this.tp);
  //     this.drawPanels(p)
  //   }
  //
  //
  //   if (!this.server) {
  //     this.server = new Server();
  //     this.server.subOnAction(msg => this.onServerAction(msg));
  //   }
  }


  step(step: Step, c: Creature) {
    this.animators.interrupt("step_" + c.id);
    const dr = step.direction;
    const o  = c.orientation;
    o.moving = dr;

    let moved      = false;
    const movement = new Animator(step.duration, f => {
      o.shift = f;

      if (!moved && f >= .5) {
        moved = true;
        switch (dr) {
          case Dir.WEST:
            o.posX++;
            break;
          case Dir.EAST:
            o.posX++;
            break;
          case Dir.NORTH:
            o.posY--;
            break;
          case Dir.SOUTH:
            o.posY++;
            break;
        }
      }

    });

    this.animators.set("step", movement);
  }


  private debug(bp: BasePainter) {
    // const p = this.proto;
    //
    // const pX = p.getX(), pY = p.getY();
    // bp.rect(pX - HCELL, pY - HCELL, CELL, CELL, {style: "red"});
    // bp.text(`${p.positionX};${p.positionY}`, pX + 1, pY + HCELL + 1, {align: 'center', font: "12px sans-serif", style: "#000"});
    // bp.text(`${p.positionX};${p.positionY}`, pX, pY + HCELL, {align: 'center', font: "12px sans-serif", style: "#fff"});
    //
    // bp.fillRect(20, 0, this.tp.width, 20, "#ffffff88");
    // bp.fillRect(0, 0, 20, this.tp.height, "#ffffff88");
    // for (let pos = -48; pos < 100; pos++) {
    //   bp.text("" + pos, toX(pos) + 2, 0, style.debugText);
    //   bp.text("" + pos, 1, toY(pos), style.debugText);
    //   bp.vline(toX(pos), 0, 20, {style: "white"});
    //   bp.hline(0, 20, toY(pos), {style: "white"});
    // }
    // bp.fillRect(0, 0, 20, 20, "#ccc");
  }

  onServerAction(msg: ApiMessage) {
    let a;

    switch (msg.action) {
      case "PROTAGONIST_ARRIVAL":
        a            = msg.data as ApiArrival;
        // this.proto   = new Protagonist(a.creature);
        this.session = new Controller(this.server!!, this.map, this.effects);
        break;

      default:
        if (this.session) this.session.onServerAction(msg)
    }
  }

  //
  // sendAction(action: Trait): Action | undefined {
  //   if (this.session) {
  //     const a                  = this.session.sendAction(action);
  //     this.lastRequestedAction = action;
  //     this.animators.set("slot_activate", new Animator(200, f => this.slotAnimatedFraction = f), () => this.slotAnimatedFraction = 0);
  //
  //     if (a) {
  //       this.animators.set("global_cooldown", new Animator(500, f => this.coolDownFraction = f));
  //     }
  //
  //     return a;
  //   }
  //
  //   return undefined;
  // }

  // onStep(dir: Dir) {
  //   if (this.session) this.session.step(dir)
  // }
  //
  // keyUp(btn: Key) {
  //   const idx = MovingButtons.indexOf(btn.code);
  //
  //   if (idx !== -1) {
  //     this.moving.remove(btn.code);
  //   }
  //
  // }
  //
  // keyDown(btn: Key) {
  //
  //   const hk = hotKeys.get(btn);
  //   if (hk === undefined) return;
  //
  //   const idx = MovingButtons.indexOf(btn.code);
  //   console.log(`Activate  `, hk.trait);
  //   if (idx !== -1) {
  //     this.moving.add((hk.trait as TraitStep).dir);
  //   } else if (this.session!!.sendAction(hk.trait)) {
  //     this.lastRequestedAction = hk.trait;
  //     this.animators.set("slot_activate", new Animator(200, f => this.slotAnimatedFraction = f), () => this.slotAnimatedFraction = 0);
  //     this.animators.set("global_cooldown", new Animator(500, f => this.coolDownFraction = f));
  //   }
  // }
}
