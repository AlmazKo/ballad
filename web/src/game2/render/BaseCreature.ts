import { Animator, Delay, LoopAnimator } from '../../anim/Animator';
import { Animators } from '../../anim/Animators';
import { TileDrawable } from '../../game/TileDrawable';
import { TilePainter } from '../../game/TilePainter';
import { debugDir, Dir, NOPE } from '../constants';
import { Creature } from '../engine/Creature';
import { Orientation } from '../engine/Orientation';
import { Camera } from './Camera';
import { QCELL } from './constants';


const map: px[] = [];

map[Dir.NORTH] = 64;
map[Dir.SOUTH] = 0;
map[Dir.EAST]  = 32;
map[Dir.WEST]  = 96;

export class DrawableCreature implements TileDrawable {

  readonly orientation: Orientation;

  private animators          = new Animators();
  private showInstantSpell   = false;
  private meleeFactor: float = 0;
  private f: floatShare      = 0;

  constructor(c: Creature) {
    this.orientation = c.orientation;


  }

  draw(time: DOMHighResTimeStamp, bp: TilePainter) {

  }

  draw2(time: DOMHighResTimeStamp, bp: TilePainter, camera: Camera) {


    const o = this.orientation;

    if (o.moving !== NOPE && !this.animators.has("step")) {
      this.startMoving()
    }

    // if (this.orientation.moving === 0 && this.animators.has("step")) {
    //   this.stopMoving();
    // }

    this.animators.run(time);


    const x = camera.absoluteX;
    const y = camera.absoluteY;
    let sy  = map[o.sight];
    let sx  = Math.floor(this.f / 0.25) * 16;
    // drawLifeLine(bp.toInDirect(x, y), this);

    let sw = 16, sh = 32;
    if (this.showInstantSpell) {
      sx = 7 * 16;
    } else if (this.meleeFactor) {
      sy += 32 * 4;
      sw = 16;
      sx = Math.floor(this.meleeFactor * 4) * 32 + 8;
    }

    bp.draw("character", sx, sy, sw, sh, x + QCELL, y);
  }

  startMoving() {
    console.log("startMoving", debugDir(this.orientation.moving));
    this.animators.interrupt("step");
    const dr       = this.orientation.moving;
    const o        = this.orientation;
    o.moving       = dr;
    const movement = new LoopAnimator(200, (f, i, isNew) => {

      this.f = f;

      if (isNew && o.requestStop) {
        o.requestStop = false;
        o.moving      = NOPE;

        switch (dr) {
          case Dir.WEST:
            o.x -= i;
            break;
          case Dir.EAST:
            o.x += i;
            break;
          case Dir.NORTH:
            o.y -= i;
            break;
          case Dir.SOUTH:
            o.y += i;
            break;
        }

        o.shift = 0;
        return true
      }

      if (dr === Dir.NORTH || dr === Dir.EAST) {
        o.shift = i + f;
      } else {
        o.shift = -i - f;
      }

      return false;
    });

    this.animators.set("step", movement);
  }

  // onRotated(rotated: boolean) {
  //   this.rotated = rotated;
  // }
  //
  //
  // onStep(step: Step): void {
  //
  //   //todo add server sync
  // }

  move() {

  }


  melee() {
    this.animators.set("melee",
      new Animator(250, f => this.meleeFactor = f),
      () => this.meleeFactor = 0);
  }

  instantSpell() {
    this.showInstantSpell = true;
    this.animators.set("instant_spell",
      new Delay(100),
      () => this.showInstantSpell = false);
  }

}
