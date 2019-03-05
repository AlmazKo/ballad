import { Package } from '../../game/actions/Package';
import { ApiArrival } from '../../game/api/ApiArrival';
import { ApiCreature } from '../../game/api/ApiCreature';
import { Metrics } from '../../game/Metrics';
import { Keyboard } from '../controller/Keyboard';
import { Dir } from '../render/constants';
import { Api } from '../server/Api';
import { World } from '../world/World';
import { Act } from './Act';
import { ProtoArrival } from './actions/ProtoArrival';
import { Creature } from './Creature';
import { Orientation } from './Orientation';
import { Player } from './Player';


const NOTHING: Act[] = [];


export class Game {

  private lastTick       = 0;
  private proto: Player | undefined;
  private creatures      = new Map<uint, Creature>();
  private actions: Act[] = NOTHING;

  constructor(
    private readonly api: Api,
    private readonly world: World,
    private readonly keyboard: Keyboard,
  ) {
    api.listen(p => this.onData(p))
    // keyboard.listenOrientation(o => this.on)
  }


  getProto(): Player | undefined {
    return this.proto;
  }

  private onData(pkg: Package) {

    console.log("onData", pkg)
    // if (p.tick > this.lastTick) {
    //
    // }

    if (!this.proto) {
      const arrival = pkg.messages[0].data as ApiArrival;
      this.proto    = this.addCreature(arrival.creature);

      this.actions.push(new ProtoArrival(1, this.proto, Date.now()))
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
    const c = new Player(ac.id, new Metrics(10, 10, "Test1"), new Orientation(Dir.SOUTH, Dir.SOUTH, 0, ac.x, ac.y));
    this.creatures.set(c.id, c);
    return c;
  }
}
