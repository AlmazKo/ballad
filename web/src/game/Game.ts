import { Animator } from '../anim/Animator';
import { Animators } from '../anim/Animators';
import { toRGBA } from '../canvas/utils';
import { BasePainter } from '../draw/BasePainter';
import { Action } from './actions/Action';
import { ApiMessage } from './actions/ApiMessage';
import { ApiArrival } from './api/ApiArrival';
import { Server } from './api/Server';
import { CELL, HCELL } from './constants';
import { Effects } from './Effects';
import { RES } from './GameCanvas';
import { Lands } from './Lands';
import { MovingKeys } from './MovingKeys';
import { Protagonist } from './Protagonist';
import { Session } from './Session';
import { BTN_1, BTN_2, BTN_3, hotKeys, Key, MovingButtons, Slot } from './Slot';
import { style } from './styles';
import { TilePainter, toX, toY } from './TilePainter';
import { PlayerAction, Traits } from './Trait';



export const DEBUG = true;

export class Game {

  private server?: Server;
  // @ts-ignore
  private tp: TilePainter;
  // @ts-ignore
  private proto: Protagonist;
  private session: Session | null   = null;
  private animators                 = new Animators();
  private coolDownFraction          = 1;
  private slots: Array<Slot | null> = [null, null, null, null, null];
  private effects                   = new Effects();
  private lastRequestedAction?: PlayerAction;
  private slotAnimatedFraction      = 0;

  constructor(private map: Lands, private moving: MovingKeys) {
    this.slots[0] = new Slot(0, BTN_1, Traits.melee);
    this.slots[1] = new Slot(1, BTN_2, Traits.fireball);
    this.slots[2] = new Slot(2, BTN_3, Traits.fireshock);
  }

  onFrame(time: DOMHighResTimeStamp, p: BasePainter) {
    if (!this.tp) this.tp = new TilePainter(p);
    this.animators.run(time);
    if (this.session) {

      if (!this.proto.orientation.moving) {
        const nextOrientation = this.moving.next2();
        if (nextOrientation) {
          this.session.sendOrientation(nextOrientation)
        }
      }
      this.session.draw(time, p);
      if (DEBUG) this.debug(p);

      this.effects.draw(time, this.tp);
      this.drawPanels(p)
    }


    if (!this.server) {
      this.server = new Server();
      this.server.subOnAction(msg => this.onServerAction(msg));
    }
  }


  private drawPanels(p: BasePainter) {

    const ctx = this.tp.ctx;

    const [width, height] = [this.tp.ctx.canvas.clientWidth, this.tp.ctx.canvas.clientHeight];

    let x   = 60;
    const y = height - 45;
    for (let i = 0; i < 5; i++) {

      x = 60 + 60 * i;

      const slot = this.slots[i];
      if (slot) {
        const slotImg = RES.get(slot.trait.resName);
        if (slotImg)
          ctx.drawImage(slotImg, 0, 0, slotImg.width, slotImg.height, x - 25, y - 25, 50, 50);

        if (this.coolDownFraction != 0) {
          p.fill(toRGBA("#000", 0.66));
          ctx.beginPath();
          ctx.arc(x, y, 25, 1.5 * Math.PI, (1.5 + this.coolDownFraction * 2) * Math.PI, true);
          ctx.lineTo(x, y);
          ctx.fill();
        }
      } else {
        p.fill(toRGBA("#000", 0.2));
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.fill();
      }


      // if (slot && this.lastRequestedAction === slot.action && this.slotAnimatedFraction) {
      //   p.circle(x, y, 23.5, {style: "yellow", width: 4});
      // } else {
      //   p.circle(x, y, 25, {style: "white", width: 2});
      //
      // }

      if (slot) {
        p.fillRect(x - 8, y + 17, 16, 16, "#cc0100");
        p.text(slot.key + "", x, y + 18, {align: 'center', font: "bold 12px sans-serif", style: "#fff"});
      }
    }
  }


  private debug(bp: BasePainter) {
    const p = this.proto;

    const pX = p.getX(), pY = p.getY();
    bp.rect(pX - HCELL, pY - HCELL, CELL, CELL, {style: "red"});
    bp.text(`${p.positionX};${p.positionY}`, pX + 1, pY + HCELL + 1, {align: 'center', font: "12px sans-serif", style: "#000"});
    bp.text(`${p.positionX};${p.positionY}`, pX, pY + HCELL, {align: 'center', font: "12px sans-serif", style: "#fff"});

    bp.fillRect(20, 0, this.tp.width, 20, "#ffffff88");
    bp.fillRect(0, 0, 20, this.tp.height, "#ffffff88");
    for (let pos = -48; pos < 100; pos++) {
      bp.text("" + pos, toX(pos) + 2, 0, style.debugText);
      bp.text("" + pos, 1, toY(pos), style.debugText);
      bp.vline(toX(pos), 0, 20, {style: "white"});
      bp.hline(0, 20, toY(pos), {style: "white"});
    }
    bp.fillRect(0, 0, 20, 20, "#ccc");
  }

  onServerAction(msg: ApiMessage) {
    let a;

    switch (msg.action) {
      case "PROTAGONIST_ARRIVAL":
        a            = msg.data as ApiArrival;
        this.proto   = new Protagonist(a.creature);
        this.session = new Session(this.server!!, this.proto, this.map, this.effects, this.tp);
        break;

      default:
        if (this.session) this.session.onServerAction(msg)
    }
  }

  sendAction(action: PlayerAction): Action | undefined {
    if (this.session) {
      const a                  = this.session.sendAction(action);
      this.lastRequestedAction = action;
      this.animators.set("slot_activate", new Animator(200, f => this.slotAnimatedFraction = f), () => this.slotAnimatedFraction = 0);

      if (a) {
        this.animators.set("global_cooldown", new Animator(500, f => this.coolDownFraction = f));
      }

      return a;
    }

    return undefined;
  }

  // onStep(dir: Dir) {
  //   if (this.session) this.session.step(dir)
  // }

  keyUp(btn: Key) {
    const idx = MovingButtons.indexOf(btn.code);

    if (idx !== -1) {
      this.moving.remove(btn.code);
    }

  }

  keyDown(btn: Key) {
    const idx = MovingButtons.indexOf(btn.code);

    if (idx !== -1) {
      this.moving.add(btn.code);
    } else if (hotKeys.has(btn)) {

    }
  }
}