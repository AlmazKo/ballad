import { px, uint } from 'types';
import { Ballad } from './canvas/Ballad';
import { CanvasComposer, Pressable, Registrar } from './canvas/CanvasComposer';
import { BasePainter } from './draw/BasePainter';
import { Moving } from './game/Moving';
import { Player } from './game/Player';
import { Spell } from './game/Spell';
import { Dir, FIRST, SECOND } from './game/types';
import { Fireball } from './game/effects/Fireball';
import { FireShock } from './game/effects/FireShock';
import { ViewMap } from './game/ViewMap';
import { Drawable } from './game/Drawable';
import { Npc } from './game/Npc';
import { Resources } from './game/Resources';
import { Metrics } from './game/Metrics';
import { FireballSpell } from './game/actions/FireballSpell';
import { Server } from './game/Server';
import { Arrival } from './game/actions/Arrival';
import { Step } from './game/actions/Step';


let INC: uint = 0;

export function nextId(): uint {
  return INC++;
}

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

  private data = new Map<uint, Npc>();//fixme change to more abstract

  add(creature: Npc) {
    this.data.set(creature.id, creature)
  }

  draw(time: DOMHighResTimeStamp, bp: BasePainter) {
    this.data.forEach(it => {
      it.draw(time, bp)
    });
  }

  onStep(action: Step) {
    const c = this.data.get(action.source.id);
    if (!c) return;

    c.onStep(action)
  }
}

const map       = new ViewMap();
const server    = new Server(map);
const moving    = new Moving();
const creatures = new Creatures();
const spells    = new Spells(creatures);
const player    = new Player(moving, map, new Metrics(100, "Player"), server);

server.subOnAction(action => {
  switch (true) {

    case action instanceof Arrival:
      creatures.add(action.source as Npc);
      break;


    case action instanceof Step:
      creatures.onStep(action as Step);
      break;

  }
});


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


    this.map.draw(p, player.positionX, player.positionY);
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

        const fireball = new FireballSpell(player, 200, 15);
        server.sendAction(fireball);

        spells.add(new Fireball(fireball, this.map));
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


