import { Dir } from '../../game2/constants';
import { ApiSpell } from './ApiSpell';

export interface ApiSpellFireball extends ApiSpell {
  distance: uint;
  duration: uint;
  direction: Dir
}
