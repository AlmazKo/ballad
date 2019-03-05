import { Act } from '../Act';
import { Player } from '../Player';

export class ProtoArrival implements Act {

  constructor(readonly id: uint,
              readonly creature: Player,
              readonly startTime: tsm) {

  }

}
