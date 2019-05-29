import { TileType } from '../constants';

export class Land {
  constructor(
    readonly tileId: uint,
    readonly type: TileType,
    readonly x: pos,
    readonly y: pos
  ) {

  }

}
