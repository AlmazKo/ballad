import { Package } from '../../game/actions/Package';
import { Api } from '../Api';
import { Act } from './Act';
import { Vision } from './Vision';
import { World } from './World';


const NOTHING: Act[] = [];


export class Game {

  private lastTick = 0;

  constructor(
    private readonly api: Api,
    readonly world: World
  ) {
    api.listen(p => this.onData(p))
  }

  private onData(pkg: Package) {

    // if (p.tick > this.lastTick) {
    //
    // }

    pkg.messages.forEach(msg => {
      msg.action
    })


  }

  private onTick() {
  }


  getActions(): Act[] {
    return NOTHING;
  }

  request(req: Request): boolean {

  }


  getVision(): Vision {

  }
}
