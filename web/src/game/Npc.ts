import { Animator, Delay } from '../anim/Animator';
import { Animators } from '../anim/Animators';
import { Step } from './actions/Step';
import { ApiCreature } from './api/ApiCreature';
import { CELL, Dir, QCELL } from './constants';
import { DrawableCreature, drawLifeLine, drawName } from './Creature';
import { RES } from './GameCanvas';
import { Metrics } from './Metrics';
import { Orientation2 } from './Orientation';
import { TilePainter } from './TilePainter';

export class Npc implements DrawableCreature {

  readonly id: int;
  readonly metrics: Metrics;
  readonly orientation: Orientation2;

  private animators        = new Animators();
  private showInstantSpell = false;
  private f                = 0;

  constructor(c: ApiCreature) {
    this.id        = c.id;
    this.metrics   = c.metrics;
    this.direction = c.direction;
    this.positionX = c.x;
    this.positionY = c.y;
  }

  getLifeShare(): float {
    return this.metrics.life / this.metrics.maxLife;
  }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

    this.animators.run(time);

    let sy: px;

    switch (this.direction) {
      case Dir.NORTH:
        sy = 64;
        break;

      case Dir.SOUTH:
        sy = 0;
        break;

      case Dir.EAST:
        sy = 32;
        break;

      case Dir.WEST:
        sy = 96;
        break;

      default:
        return;
    }


    const p = bp.toInTile(this.positionX, this.positionY, this.shiftX, this.shiftY);

    const inZon = true;//inZone(this.positionX, this.positionY, PROTO_X, PROTO_Y, 3)

    if (inZon) drawLifeLine(p, this);
    let sx = Math.floor(this.f * 4) * 16;

    let img;
    if (this.isPlayer) {
      img = RES.get("character_alien");

      if (this.showInstantSpell) {
        sx = 7 * 16;
      }
    } else {
      img = RES.get("NPC_test")
    }


    bp.drawTile(img, sx, sy, 16, 32, this.positionX, this.positionY, this.shiftX + QCELL, this.shiftY);

    if (inZon) drawName(p, this);
  }


  instantSpell() {
    this.showInstantSpell = true;
    this.animators.set("instant_spell", new Delay(100), () => {
      this.showInstantSpell = false
    });
  }
}