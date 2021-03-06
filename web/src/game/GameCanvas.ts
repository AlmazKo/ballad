import { CanvasComposer, Pressable, Registrar } from '../canvas/CanvasComposer';
import { BasePainter } from '../draw/BasePainter';
import { ajax } from '../util/net';
import { Tiles } from './api/Tiles';
import { ViewMap } from './api/ViewMap';
import { BTN_1, BTN_2, BTN_3, Dir } from './constants';
import { Game, PlayerAction } from './Game';
import { Lands } from './Lands';
import { MovingKeys } from './MovingKeys';
import { Resources } from './Resources';

export declare var RES: Resources;

const moving = new MovingKeys();

export class GameCanvas implements CanvasComposer, Pressable {

  // @ts-ignore
  height: px;
  // @ts-ignore
  width: px;

  // @ts-ignore
  private p: BasePainter;
  // @ts-ignore
  private loading = true;
  // @ts-ignore
  private game: Game;


  constructor() {
    RES = new Resources();
    Promise.zip(RES.loadBasic(), ajax('/map'), ajax('/tiles'), (_, map, tiles) => {
          const lands  = new Lands(map as ViewMap, tiles as Tiles);
          this.game    = new Game(lands, moving);
          this.loading = false;
        }
      );
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

  onFrame(time: DOMHighResTimeStamp, frameId?: uint): void {
    this.p.clearArea(this.width, this.height);

    const p = this.p;

    if (this.loading) {
      p.text("Loading...", 30, 30)
    } else {
      this.game.onFrame(time, p)
    }
  }

  onEndFrame(time: DOMHighResTimeStamp, error?: Error): void {
  }

  register(register: Registrar): void {
    register('pressable', this);
  }

  keyUp(e: KeyboardEvent): void {

    switch (e.keyCode) {
      case 37:
        moving.remove(Dir.WEST);
        break;
      case 39:
        moving.remove(Dir.EAST);
        break;
      case 38:
        moving.remove(Dir.NORTH);
        break;
      case 40:
        moving.remove(Dir.SOUTH);
        break;
      // case 70:
      //   player.onFreezeDirection(false);
      //   break;
      // case 82: //r
      //   player.onRotated(false);
      //   break;

    }
  }

  keydown(e: KeyboardEvent): void {

    const g = this.game;
    switch (e.keyCode) {
      case 37:
        g.onStep(Dir.WEST);
        break;
      case 39:
        g.onStep(Dir.EAST);
        break;
      case 38:
        g.onStep(Dir.NORTH);
        break;
      case 40:
        g.onStep(Dir.SOUTH);
        break;
      case BTN_1:
        g.sendAction(PlayerAction.MELEE);
        break;
      case BTN_2:
        g.sendAction(PlayerAction.FIREBALL);
        break;
      case BTN_3:
        g.sendAction(PlayerAction.FIRESHOCK);
        break;
      // case 70: //f
      //   player.onFreezeDirection(true);
      //   break;
      // case 82: //r
      //   player.onRotated(true);
      //   break;
    }


  }

  keypress(e: KeyboardEvent): void {

  }

}