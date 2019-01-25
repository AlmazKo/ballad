import { MapPiece } from '../../game/api/MapPiece';
import { ajax } from '../../util/net';
import { Land } from './Land';


/**
 * Map position
 */
declare type piecePos = int;
export const floor = Math.floor;

const PIECE_SIZE = 16;


export enum Loading {
  REQUESTING = 1, FAIL, ABSENCE
}

class Piece {
  constructor(
    readonly x: pos,
    readonly y: pos,
    readonly data: Land[]) {
  }
}

export class World {

  private peices: Array<Array<Piece | Loading>> = [[]];

  iterateLands(posX: pos, posY: pos, radius: uint, handler: (p: Piece | undefined) => void) {

    const fromX = floor((posX - radius) / PIECE_SIZE);
    const fromY = floor((posY - radius) / PIECE_SIZE);

    const toX = floor((posX + radius) / PIECE_SIZE);
    const toY = floor((posY + radius) / PIECE_SIZE);

    for (let x = fromX; x <= toX; x++) {
      for (let y = fromY; y <= toY; x++) {
        handler(this.getPiece(x, y))
      }
    }
  }


  getPiece(x: piecePos, y: piecePos): Piece | undefined {
    let r = this.peices[x];
    if (r == undefined) {
      r              = [];
      this.peices[x] = r;

    }
    const p = r[y];

    if (p instanceof Piece) {
      return p;
    } else {
      if (p === undefined) {
        r[y] = Loading.REQUESTING;
        this.loadPiece(x, y)
          .then(i => r[y] = i)
          .catch(() => r[y] = Loading.FAIL)
      }
      return undefined;
    }
  }

  get(x: pos, y: pos): Land | undefined {
    const pX = floor(x / PIECE_SIZE);
    const pY = floor(y / PIECE_SIZE);

    const p = this.getPiece(pX, pY);
    if (p === undefined) return undefined;

    const offsetX = x % PIECE_SIZE;
    const offsetY = y % PIECE_SIZE;

    return p.data[offsetY * PIECE_SIZE + offsetX];
  }

  loadPiece(x: piecePos, y: piecePos): Promise<Piece> {
    return ajax(`/map-piece?x=${x}&y=${y}`).map((d: MapPiece) => {

      const lands = [];
      const b1    = d.terrain;
      const b2    = d.objects1;

      for (let i = 0; i < d.terrain.length; i++) {
        lands[i] = new Land(b1[i], b2[i], d.x + i % d.height, d.y + floor(i/d.width))
      }

      return new Piece(d.x, d.y, lands)
    })
  }


}
