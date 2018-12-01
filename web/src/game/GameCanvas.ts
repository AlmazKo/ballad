import { CanvasComposer, Pressable, Registrar } from '../canvas/CanvasComposer';
import { px, uint } from '../types';
import { BasePainter } from '../draw/BasePainter';
import { Dir, FIRST, SECOND } from './types';
import { Resources } from './Resources';
import { Game, PlayerAction } from './Game';
import { Lands } from './Lands';
import { MovingKeys } from './MovingKeys';

export declare var RES: { [index: string]: HTMLImageElement };

const moving = new MovingKeys();

export class GameCanvas implements CanvasComposer, Pressable {

  height: px;
  width: px;


  private p: BasePainter;
  private loading = true;
  private game: Game;


  constructor() {
    // const game = new Game();

    new Resources().onLoad(r => {
      RES          = r;
      this.game    = new Game(new Lands(), moving);
      this.loading = false;
    })
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

    if (this.loading) {
      p.text("Loading...", 30, 30)
    } else {
      this.game.onFrame(time, p)
    }
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
      case FIRST:
        g.sendAction(PlayerAction.FIREBALL);
        break;
      case SECOND:
        g.sendAction(PlayerAction.FIRESHOCK);
      //   break;
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