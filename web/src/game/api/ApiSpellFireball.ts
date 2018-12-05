import { ApiSpell } from './ApiSpell';
import { Dir } from '../types';

export interface ApiSpellFireball extends ApiSpell {
  direction: Dir
}