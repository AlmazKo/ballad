import { ApiMessage } from './ApiMessage';

export interface Package {
  readonly tick: uint,
  readonly time: tsm,
  readonly messages: ApiMessage[],

}
