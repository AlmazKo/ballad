import { MapPiece } from '../../game/api/MapPiece';
import { Api } from '../server/Api';
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

export class Piece {
  constructor(
    readonly x: pos,
    readonly y: pos,
    readonly data: Land[]) {
  }
}

export class World {

  private peices: Array<Array<Piece | Loading>> = [[]];


  constructor(private readonly api: Api) {

  }

  iterateLands(posX: pos, posY: pos, radius: uint, handler: (p: Piece | undefined) => void) {

    const fromX = floor((posX - radius) / PIECE_SIZE);
    const fromY = floor((posY - radius) / PIECE_SIZE);

    const toX = floor((posX + radius) / PIECE_SIZE);
    const toY = floor((posY + radius) / PIECE_SIZE);

    for (let x = fromX; x <= toX; x++) {
      for (let y = fromY; y <= toY; y++) {
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

    return this.api.getMapPiece(x, y).map((p: MapPiece) => {
      const lands = [];
      const b1    = p.terrain;
      const b2    = p.objects1;

      for (let i = 0; i < p.terrain.length; i++) {
        lands[i] = new Land(b1[i], b2[i], p.x + i % p.height, p.y + floor(i / p.width))
      }

      return new Piece(p.x, p.y, lands)
    })
  }


  canStep(from: [px, px], to: [px, px], b: boolean) {
    return false;
  }
}
