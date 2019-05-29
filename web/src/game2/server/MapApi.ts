import { MapPieceRaw } from '../../game/api/MapPieceRaw';

export interface MapApi {

  getMapPiece(x: int, y: int): Promise<MapPieceRaw>

}
