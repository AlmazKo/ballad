import { index, int, px, uint } from '../types';
import { ajax } from '../util/net';
import { BasePainter } from '../draw/BasePainter';
import { CELL, Dir } from './types';
import { style } from './styles';
import { StrokeStyle } from '../draw/StrokeStyleAcceptor';
import { Creature } from './Creature';
import { RES } from './GameCanvas';


// type TileType = 'water'| ''
interface RawTile {
  id: index;
  type: string;
}

class Tile {
  id: index;
  type: string | null;
  posX: int;
  posY: int;
  sx: px;
  sy: px;

  constructor(id: index, type: string | null, posX: int, posY: int, sx: px, sy: px) {
    this.id   = id;
    this.type = type;
    this.posX = posX;
    this.posY = posY;
    this.sx   = sx;
    this.sy   = sy;
  }
}

interface Chunk {
  data: int[],
  x: int,
  y: int
}

let rawMap: any                = null;
let tiles: Map<index, RawTile> = new Map();

ajax("/map", data => {
  rawMap = data.data
});

ajax("/tiles", (data: any) => {
  data.data.forEach((t: any) => {
    const tile = {id: t.id, type: t.type.toLowerCase()} as any;
    tiles.set(t.id, tile);
  });
});

const MAP_SIZE: uint   = 32;
const TILE_SIZE: px    = 32;//fixme remove. take from api
const TILESET_SIZE: px = 23;//fixme remove. take from api


export class Lands {
  private tiles   = new Map<index, Tile>();
  private basic   = new Uint16Array(MAP_SIZE * MAP_SIZE);
  private objects = new Uint16Array(MAP_SIZE * MAP_SIZE);

  constructor() {
  }

  canMove(from: [index, index], to: [index, index], isFly: boolean = false): boolean {
    const [x, y]    = to;
    const maxBounds = x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE;
    if (!maxBounds) return false;


    const basicTile = this.basic[x + y * MAP_SIZE];
    if (!basicTile) return false;


    let tile = this.tiles.get(basicTile);

    if (!tile) return true;

    if (tile.type === 'water' && !isFly) return false;
    if (tile.type === 'blocked') return false;


    tile = this.tiles.get(this.objects[x + y * MAP_SIZE]);
    if (!tile) return true;

    if (tile.type === 'water' && !isFly) return false;
    if (tile.type === 'blocked') return false;

    return true;
  }

  canStep(from: [index, index], to: Dir, isFly: boolean = false): boolean {

    let [x, y] = from;
    switch (to) {
      case Dir.NORTH:
        y--;
        break;
      case Dir.SOUTH:
        y++;
        break;
      case Dir.WEST:
        x--;
        break;
      case Dir.EAST:
        x++;
        break;

    }
    return this.canMove(from, [x, y], isFly)
  }


  getBasic(posX: index, posY: index): Tile | undefined {
    const tileId = this.basic[posX + posY * MAP_SIZE];
    if (!tileId) return undefined;

    return this.tiles.get(tileId);
  }


  draw(p: BasePainter, playerX: index, playerY: index) {

    if (!rawMap || !tiles.size) return;

    if (this.tiles.size === 0) {
      this.initData(rawMap, tiles);
    }


    this.basic.forEach((tileId: uint, idx: index) => {
      this.drawTile(p, tileId, idx);
    });

    this.objects.forEach((tileId: uint, idx: index) => {
      this.drawTile(p, tileId, idx);
    });

    for (let pos = 1; pos < MAP_SIZE; pos++) {
      p.vline(pos * CELL, 0, MAP_SIZE * CELL, style.grid as StrokeStyle);
      p.hline(0, MAP_SIZE * CELL, pos * CELL, style.grid as StrokeStyle);
    }


    for (let x = 0; x < MAP_SIZE; x++) {
      for (let y = 0; y < MAP_SIZE; y++) {
        p.text("" + x + "x" + y, x * CELL + 1, y * CELL, style.debugText)
      }
    }
  }


  drawTile(p: BasePainter, tileId: uint, idx: index) {

    const img = RES['map1'];
    const t   = this.tiles.get(tileId);
    if (!t) return;
    const x = (idx % MAP_SIZE) * CELL;
    const y = Math.floor(idx / MAP_SIZE) * CELL;

    p.ctx.drawImage(img, t.sx, t.sy, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
  }

  private initData(raw: int[], tileProps: Map<index, RawTile>) {

    let posX = 16, posY = 16;


    posX = 0;
    posY = 0;
    raw.forEach((t, idx) => {
      if (t === 0) return;

      const tileX = t % TILESET_SIZE;
      const tileY = Math.floor(t / TILESET_SIZE);
      const sx    = TILE_SIZE * tileX;
      const sy    = TILE_SIZE * tileY;
      const props = tileProps.get(t);
      const type  = !props ? null : props.type;
      this.tiles.set(t, new Tile(t, type, tileX, tileY, sx, sy));

      this.basic[posX + idx % 32 + (posY + Math.floor(idx / 32)) * MAP_SIZE] = t;

    });

  }
}