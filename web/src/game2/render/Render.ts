import { Animators } from '../../anim/Animators';
import { BasePainter } from '../../draw/BasePainter';
import { Game } from '../engine/Game';
import { LandsLayer } from './LandsLayer';

export class Camera {

  constructor(
    public offset: floatShare,
    public posX: pos,
    public posY: pos) {

  }

  toX(pos: pos): px {

  }

  toY(pos: pos): px {

  }


}

export class Render {


  private width: px;
  private height: px;
  private p: BasePainter;
  private game: Game;
  private animators = new Animators();
  private lands: LandsLayer;

  private readonly camera: Camera;


  constructor(game: Game) {
    this.game   = game;
    this.lands  = new LandsLayer(game.world);
    this.camera = {offset: 0, posX: 15, posY: 15}
  }


  updateContext(ctx: CanvasRenderingContext2D, width: px, height: px): void {
    this.width  = width;
    this.height = height;
    this.p      = new BasePainter(ctx);
    this.lands.init(ctx, width, height)
  }


  onFrame(time: DOMHighResTimeStamp) {
    const actions = this.game.getActions();
    if (actions.length > 0) return;


    if (!this.camera) {
      const arrival = actions[0];


    }

    //start actions

    //?
    this.animators.run(time);


    this.lands.draw(time, this.camera)
    //draw lands
    //draw creatures
    //draw effects
    //draw fog


    // draw panels


  }

}
