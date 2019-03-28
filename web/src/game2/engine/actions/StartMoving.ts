import { Dir } from '../../constants';
import { Act } from '../Act';
import { Player } from '../Player';

export class StartMoving implements Act {

  constructor(readonly id: uint,
              readonly creature: Player,
              readonly startTime: tsm,
              readonly speed: ms,
              readonly dir: Dir) {

  }

}
