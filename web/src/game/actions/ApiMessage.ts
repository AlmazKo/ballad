import { Creature } from '../Creature';
import { uint } from '../../types';

export interface ApiMessage {
  readonly id: uint,
  readonly action: string,
  readonly type?: string,
  readonly data: object,
}