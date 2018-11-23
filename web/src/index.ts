import { px, uint } from 'types';
import { Ballad } from './canvas/Ballad';
import { CanvasComposer, Pressable, Registrar } from './canvas/CanvasComposer';
import { BasePainter } from './draw/BasePainter';
import { Moving } from './game/Moving';
import { Player } from './game/Player';
import { Spell } from './game/Spell';
import { Dir, FIRST, SECOND } from './game/types';
import { Fireball } from './game/Fireball';
import { FireShock } from './game/FireShock';
import { ViewMap } from './game/ViewMap';
import { Drawable } from './game/Drawable';
import { Creature } from './game/Creature';
import { Npc } from './game/Npc';
import { Resources } from './game/Resources';
import { Metrics } from './game/Metrics';


class Spells implements Drawable {

  private data = [] as Array<Spell>;
  private creatures: Creatures;

  constructor(creatures: Creatures) {
    this.creatures = creatures;
  }

  add(bullet: Spell) {
    this.data.push(bullet)
  }


  draw(time: DOMHighResTimeStamp, bp: BasePainter) {
    this.data.forEach(it => {
      it.draw(time, bp)
    });


    //fixme optimize?
    this.data = this.data.filter(b => !b.isFinished)
  }
}

class Creatures implements Drawable {

  private data = [] as Array<Creature & Drawable>;

  add(creature: Creature & Drawable) {
    this.data.push(creature)
  }

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {
    this.data.forEach(it => {
      it.draw(time, bp)
    });

  }
}

const moving    = new Moving();
const creatures = new Creatures();
const spells    = new Spells(creatures);

creatures.add(new Npc(new Metrics(50, "Boar"), 15, 19));

const map    = new ViewMap();
const player = new Player(moving, map, new Metrics(100, "Player"));

class GameCanvas implements CanvasComposer, Pressable {

  height: px;
  width: px;

  private p: BasePainter;
  private map = map;

  constructor() {

  }

  changeSize(width: px, height: px): void {
    this.width  = width;
    this.height = height;
  }

  destroy(): void {
  }

  init(ctx: CanvasRenderingContext2D, width: px, height: px): void {
    this.width  = width;
    this.height = height;
    this.p      = new BasePainter(ctx);
  }

  onEndFrame(time: DOMHighResTimeStamp, error?: Error): void {
  }

  onFrame(time: DOMHighResTimeStamp, frameId?: uint): void {
    this.p.clearArea(this.width, this.height);

    const p = this.p;


    this.map.draw(p);
    creatures.draw(time, p);
    player.draw(time, p);
    spells.draw(time, p);
  }

  register(register: Registrar): void {
    register('pressable', this);
  }

  keyUp(e: KeyboardEvent): void {

    switch (e.keyCode) {
      case Dir.LEFT:
        moving.remove(Dir.LEFT);
        break;
      case Dir.RIGHT:
        moving.remove(Dir.RIGHT);
        break;
      case Dir.UP:
        moving.remove(Dir.UP);
        break;
      case Dir.DOWN:
        moving.remove(Dir.DOWN);
        break;
      case 70:
        player.onFreezeDirection(false);
        break;
      case 82: //r
        player.onRotated(false);
        break;

    }
  }

  keydown(e: KeyboardEvent): void {

    switch (e.keyCode) {
      case Dir.LEFT:
        player.onStep(Dir.LEFT);
        break;
      case Dir.RIGHT:
        player.onStep(Dir.RIGHT);
        break;
      case Dir.UP:
        player.onStep(Dir.UP);
        break;
      case Dir.DOWN:
        player.onStep(Dir.DOWN);
        break;
      case FIRST:
        spells.add(new Fireball(player.direction, player.positionX, player.positionY, this.map));
        break;
      case SECOND:
        spells.add(new FireShock(player.positionX, player.positionY));
        break;
      case 70: //f
        player.onFreezeDirection(true);
        break;
      case 82: //r
        player.onRotated(true);
        break;
    }


  }

  keypress(e: KeyboardEvent): void {

  }

}


export declare var RES: { [index: string]: HTMLImageElement };

window.onload = () => {
  let div = document.getElementById("game");
  console.info(div);
  let p = new Ballad(div);

  new Resources().onLoad(r => {
    RES = r;
    p.start(new GameCanvas());
  })


};


