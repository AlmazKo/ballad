import { Action } from '../../game/actions/Action';
import { Package } from '../../game/actions/Package';
import { MapPiece } from '../../game/api/MapPiece';
import { Tiles } from '../../game/api/Tiles';

export interface Api {

  listen(handler: (pkg: Package) => void): void;

  sendAction(action: Action): void;

  getMapPiece(x: int, y: int) : Promise<MapPiece>

  getTileSet(id: int) : Promise<Tiles>
}
