import { Package } from '../../game/actions/Package';
import { ApiArrival } from '../../game/api/ApiArrival';
import { ApiCreature } from '../../game/api/ApiCreature';
import { Metrics } from '../../game/Metrics';
import { Dir, NOPE } from '../constants';
import { Api } from '../server/Api';
import { World } from '../world/World';
import { Act } from './Act';
import { ProtoArrival } from './actions/ProtoArrival';
import { Creature } from './Creature';
import { Focus, Moving } from './Moving';
import { MovingListener } from './MovingListener';
import { Orientation } from './Orientation';
import { Player } from './Player';


const NOTHING: Act[] = [];
let ID               = 1;

export class Game implements MovingListener {

  private lastTick       = 0;
  // @ts-ignore
  private proto: Player;
  private creatures      = new Map<uint, Creature>();
  private actions: Act[] = NOTHING;

  constructor(
    private readonly api: Api,
    private readonly world: World,
    private readonly mvg: Moving,
  ) {
    api.listen(p => this.onData(p))
    mvg.listen(this)
  }


  getProto(): Player | undefined {
    return this.proto;
  }

  private onData(pkg: Package) {

    console.log("onData", pkg);
    // if (p.tick > this.lastTick) {
    //
    // }

    if (!this.proto) {
      const arrival = pkg.messages[0].data as ApiArrival;
      this.proto    = this.addCreature(arrival.creature);

      this.actions.push(new ProtoArrival(ID++, this.proto, Date.now()))
    }

    pkg.messages.forEach(msg => {
      // actions.push()msg.action
    })

  }

  private onTick() {

  }

  getActions(): Act[] {
    return this.actions.splice(0);
  }

  // request(req: Request): boolean {
  //
  // }
  //
  //
  // getVision(): Vision {
  //
  // }

  private addCreature(ac: ApiCreature): Creature {

    //fixme
    const c = new Player(ac.id, new Metrics(10, 10, "Test1"), new Orientation(NOPE, Dir.SOUTH, 0, ac.x, ac.y));
    this.creatures.set(c.id, c);
    return c;
  }

  onStartMoving(f: Focus) {
    const p              = this.proto!!;
    p.orientation.moving = f.moving;
    p.orientation.sight  = f.sight;


    console.log("Start moving:", f, p.orientation);

    // this.actions.push(new StartMoving(ID++, this.proto, Date.now(), 200, f.moving))

  }

  onChangeSight(dir: Dir): void {
  }

  onStopMoving(): void {
    console.log("Stop moving");
    const p                   = this.proto!!;
    p.orientation.requestStop = true;
  }
}
