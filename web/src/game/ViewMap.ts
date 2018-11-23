import { index, int, px, uint } from '../types';
import { ajax } from '../util/net';
import { BasePainter } from '../draw/BasePainter';
import { RES } from '../index';
import { CELL } from './types';
import { style } from './styles';
import { StrokeStyle } from '../draw/StrokeStyleAcceptor';


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
  y: int,
  height: int,
  width: int
}

let rawMap: any                = null;
let tiles: Map<index, RawTile> = new Map();

ajax("map.json", data => {
  rawMap = data.layers
});

ajax("tileset.json", (data: any) => {
  data.tiles.forEach((t: any) => {
    const tile = {id: t.id} as any;

    t.properties.forEach((p: any) => {
      if (p.name === "type") {
        tile['type'] = p.value;
      }
    });
    tiles.set(t.id, tile);
  });
});

const MAP_SIZE: uint   = 32;
const TILE_SIZE: px    = 32;
const TILESET_SIZE: px = 23;

export class ViewMap {
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

  draw(p: BasePainter) {

    if (!rawMap && !tiles.size) return;

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

  }

  drawTile(p: BasePainter, tileId: uint, idx: index) {

    const img = RES['map1'];
    const t   = this.tiles.get(tileId);
    if (!t) return;
    const x = (idx % MAP_SIZE) * CELL;
    const y = Math.floor(idx / MAP_SIZE) * CELL;

    p.ctx.drawImage(img, t.sx, t.sy, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
  }

  private initData(raw: any, tileProps: Map<index, RawTile>) {

    let posX = 16, posY = 16;

    raw[0].chunks.forEach((c: Chunk) => {

      posX = 16 + c.x;
      posY = 9 + c.y;
      c.data.forEach((v, idx) => {
        if (v === 0) return;


        const t     = v - 1;
        const tileX = t % TILESET_SIZE;
        const tileY = Math.floor(t / TILESET_SIZE);
        const sx    = TILE_SIZE * tileX;
        const sy    = TILE_SIZE * tileY;
        const props = tileProps.get(t);
        const type  = !props ? null : props.type;
        this.tiles.set(t, new Tile(t, type, tileX, tileY, sx, sy));

        this.basic[posX + idx % c.width + (posY + Math.floor(idx / c.height)) * MAP_SIZE] = t;

      });
    });

    raw[1].chunks.forEach((c: Chunk) => {
      posX = 16 + c.x;
      posY = 9 + c.y;
      c.data.forEach((v, idx) => {
        if (v === 0) return;
        const t = v - 1;

        const tileX = t % TILESET_SIZE;
        const tileY = Math.floor(t / TILESET_SIZE);
        const sx    = TILE_SIZE * tileX;
        const sy    = TILE_SIZE * tileY;
        const props = tileProps.get(t);
        const type  = !props ? null : props.type;

        this.tiles.set(t, new Tile(t, type, tileX, tileY, sx, sy));

        this.objects[posX + idx % c.width + (posY + Math.floor(idx / c.height)) * MAP_SIZE] = t;
      })
    });
  }
}