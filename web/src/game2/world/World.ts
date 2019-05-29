import { MapApi } from '../server/MapApi';
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


  constructor(private readonly api: MapApi) {

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

    return this.api.getMapPiece(x, y).map(p => {
      const lands = [];
      let pair: [uint, uint];

      for (let i = 0; i < p.length; i++) {
        pair     = p[i];
        lands[i] = new Land(pair[0], pair[1], x * 16 + i % 16, y * 16 + floor(i / 16))
      }

      return new Piece(x * 16, y * 16, lands)
    })
  }


  canStep(from: [px, px], to: [px, px], b: boolean) {
    return false;
  }
}
