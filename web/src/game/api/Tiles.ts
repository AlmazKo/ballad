import { int, uint } from '../../types';

export interface Tiles {
  readonly columns: uint,
  readonly height: uint,
  readonly data: Array<{ id: int, type: string }>
}