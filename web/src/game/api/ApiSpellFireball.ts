import { ApiSpell } from './ApiSpell';
import { Dir } from '../types';
import { uint } from '../../types';

export interface ApiSpellFireball extends ApiSpell {
  distance: uint;
  duration: uint;
  direction: Dir
}