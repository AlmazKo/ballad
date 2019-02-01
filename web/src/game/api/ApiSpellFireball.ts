import { Dir } from '../../game2/render/constants';
import { ApiSpell } from './ApiSpell';

export interface ApiSpellFireball extends ApiSpell {
  distance: uint;
  duration: uint;
  direction: Dir
}
