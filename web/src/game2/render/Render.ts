import { Animators } from '../../anim/Animators';
import { CanvasContext } from '../../draw/CanvasContext';
import { Game } from '../engine/Game';
import { Camera } from './Camera';
import { LandsLayer } from './LandsLayer';


export class Render {

  private width: px  = 100;
  private height: px = 100;
  private p: CanvasContext | undefined;
  private animators  = new Animators();

  private readonly camera: Camera;


  constructor(
    private readonly game: Game,
    private readonly lands: LandsLayer) {
    this.camera = new Camera(0, 20, 20);
  }


  updateContext(ctx: CanvasRenderingContext2D, width: px, height: px): void {
    this.width  = width;
    this.height = height;
    this.p      = new CanvasContext(ctx);
    this.lands.init(this.p)
  }


  onFrame(time: DOMHighResTimeStamp) {

    const player = this.game.getProto();
    if (!player) return;


    // const actions = this.game.getActions();
    // if (actions.length > 0) return;


    //start actions

    //?
    this.animators.run(time);

    if (this.p) this.p.clear();

    this.lands.draw(time, this.camera)
    //draw lands
    //draw creatures
    //draw effects
    //draw fog


    // draw panels


  }

}
