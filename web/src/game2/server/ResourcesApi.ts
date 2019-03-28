import { MapPiece } from '../../game/api/MapPiece';
import { Tiles } from '../../game/api/Tiles';

export interface ResourcesApi {

  getMapPiece(x: int, y: int): Promise<MapPiece>

  getTileSet(id: int): Promise<Tiles>
}
