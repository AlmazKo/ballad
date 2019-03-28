import { Animators } from '../../anim/Animators';
import { CanvasContext } from '../../draw/CanvasContext';
import { TilePainter } from '../../game/TilePainter';
import { ProtoArrival } from '../engine/actions/ProtoArrival';
import { StartMoving } from '../engine/actions/StartMoving';
import { Game } from '../engine/Game';
import { DrawableCreature } from './BaseCreature';
import { Camera } from './Camera';
import { LandsLayer } from './LandsLayer';


export class Render {

  private width: px  = 100;
  private height: px = 100;
  private p: CanvasContext | undefined;
  private animators  = new Animators();

  private readonly camera: Camera;
  private player: DrawableCreature | undefined;
  private phantoms: DrawableCreature[] = [];
  // @ts-ignore
  private tp: TilePainter;


  constructor(
    private readonly game: Game,
    private readonly lands: LandsLayer) {
    this.camera = new Camera(0, -4, 1);
  }


  updateContext(ctx: CanvasRenderingContext2D, width: px, height: px): void {
    this.width  = width;
    this.height = height;
    this.p      = new CanvasContext(ctx);
    this.tp     = new TilePainter(this.p);
    this.lands.init(this.p);
    this.lands.changeSize(width, height);
  }


  onFrame(time: DOMHighResTimeStamp) {

    const player = this.game.getProto();
    const camera = this.camera;
    if (!player) return;


    const actions = this.game.getActions();
    // if (actions.length > 0) return;


    //start actions

    //?

    for (const action of actions) {

      if (action instanceof ProtoArrival) {
        camera.x    = action.creature.orientation.x;
        camera.y    = action.creature.orientation.y;
        this.player = new DrawableCreature(action.creature)
      }

      if (action instanceof StartMoving) {
        this.player!!.startMoving(action)
      }

    }

    this.animators.run(time);

    if (this.p) this.p.clear();

    camera.absoluteX = this.width / 2;
    camera.absoluteY = this.height / 2;

    this.lands.draw(time, camera)


    this.player!!.draw(time, this.tp)

    //draw lands
    //draw creatures


    //draw effects
    //draw fog


    // draw panels


  }

}
