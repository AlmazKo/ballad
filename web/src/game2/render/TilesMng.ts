import { Tiles } from '../../game/api/Tiles';
import { Tile } from '../../game/Lands';
import { ajax } from '../../util/net';
import { Loading } from '../engine/World';


const TILE_SIZE: px    = 32;//fixme remove. take from api
const TILESET_SIZE: px = 23;//fixme remove. take from api

export class TilesMng {

  private readonly data = Array<Map<index, Tile> | Loading>();

  get(id: int): Tile | undefined {

    const tileSetId = id % 4086;
    const ts        = this.getTileSet(tileSetId);
    if (ts === undefined) return;

    return ts.get(id)
  }

  private getTileSet(tsId: index): Map<index, Tile> | undefined {

    const ts = this.data[tsId];
    if (ts instanceof Map) {
      return ts;
    } else {
      if (ts === undefined) {
        this.data[tsId] = Loading.REQUESTING;
        this.loadTileSet(tsId)
          .then(i => this.data[tsId] = i)
          .catch(() => this.data[tsId] = Loading.FAIL)
      }
      return undefined;
    }
  }


  private read(typedTiles: Tiles): Map<index, Tile> {

    const data = new Map<index, Tile>()

    typedTiles.data.forEach(t => {
      const tileX = t.id % TILESET_SIZE;
      const tileY = Math.floor(t.id / TILESET_SIZE);
      const sx    = TILE_SIZE * tileX;
      const sy    = TILE_SIZE * tileY;
      data.set(t.id, new Tile(t.id, t.type, tileX, tileY, sx, sy));
    });

    return data
  }

  private loadTileSet(id: uint): Promise<Map<index, Tile>> {
    return ajax('/tile-set?id=' + id).map((t: Tiles) => this.read(t))
  }
}