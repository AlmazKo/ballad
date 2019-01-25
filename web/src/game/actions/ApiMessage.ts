import { ApiEvent } from '../api/ApiEvent';

export type ActionName = 'PROTAGONIST_ARRIVAL' | ''
export type Type = 'SPELL' | ''

export interface ApiMessage {
  readonly id: uint
  readonly action: ActionName
  readonly type: Type
  readonly data: ApiEvent
}
