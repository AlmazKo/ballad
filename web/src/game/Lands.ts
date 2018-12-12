import { index, int, px, uint } from '../types';
import { BasePainter } from '../draw/BasePainter';
import { CELL, coord, Dir } from './types';
import { RES } from './GameCanvas';
import { style } from './styles';
import { StrokeStyle } from '../draw/StrokeStyleAcceptor';
import { DrawableCreature } from './Creature';
import { TilePainter, toX, toY } from './TilePainter';
import { Npc } from './Npc';
import { Effect } from './Effect';
import { ViewMap } from './api/ViewMap';
import { Tiles } from './api/Tiles';


export declare var POS_X: coord;
export declare var POS_Y: coord;

export declare var PROTO_X: coord;
export declare var PROTO_Y: coord;
export declare var SHIFT_X: px;
export declare var SHIFT_Y: px;


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

const TILE_SIZE: px    = 32;//fixme remove. take from api
const TILESET_SIZE: px = 23;//fixme remove. take from api


export class Lands {
  private readonly tiles = new Map<index, Tile>();
  private readonly basic: Uint16Array;
  private readonly objects: Uint16Array;
  private readonly width: uint;
  private readonly offsetX: int;
  private readonly offsetY: int;
  private readonly height: uint;

  public creatures = new Map<uint, Npc>();
  public effects   = [] as Array<Effect>;

  constructor(map: ViewMap, tiles: Tiles) {
    this.width   = map.width;
    this.height  = map.height;
    this.offsetX = map.offsetX;
    this.offsetY = map.offsetY;
    this.basic   = new Uint16Array(map.terrain);
    this.objects = new Uint16Array(map.objects1);

    tiles.data.forEach(t => {
      const tileX = t.id % TILESET_SIZE;
      const tileY = Math.floor(t.id / TILESET_SIZE);
      const sx    = TILE_SIZE * tileX;
      const sy    = TILE_SIZE * tileY;
      this.tiles.set(t.id, new Tile(t.id, t.type, tileX, tileY, sx, sy));
    })
  }

  canMove(from: [index, index], to: [index, index], isFly: boolean = false): boolean {
    const [x, y] = to;
    if (!this.isValid(x, y)) return false;


    const basicTile = this.basic[this.toIndex(x, y)];
    if (!basicTile) return false;


    let tile = this.tiles.get(basicTile);

    if (!tile) return true;

    if (tile.type === 'WATER' && !isFly) return false;
    if (tile.type === 'WALL') return false;


    tile = this.tiles.get(this.objects[this.toIndex(x, y)]);
    if (!tile) return true;

    if (tile.type === 'WATER' && !isFly) return false;
    if (tile.type === 'WALL' && !isFly) return false;

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
    const canMv = this.canMove(from, [x, y], isFly);
    if (!canMv) return false;

    for (const c of this.creatures.values()[Symbol.iterator]()) {
      if (c.positionX === x && c.positionY === y) return false;
    }

    return true;
  }

  //
  // getBasic(posX: index, posY: index): Tile | undefined {
  //   const tileId = this.basic[posX + posY * MAP_WIDTH];
  //   if (!tileId) return undefined;
  //
  //   return this.tiles.get(tileId);
  // }


  updateFocus(p: TilePainter, proto: DrawableCreature) {

    POS_X   = proto.positionX - Math.floor(p.width / CELL / 4);
    POS_Y   = proto.positionY - Math.floor(p.height / CELL / 4);
    PROTO_X = proto.positionX;
    PROTO_Y = proto.positionY;
    SHIFT_X = proto.shiftX;
    SHIFT_Y = proto.shiftY;
  }

  draw(p: BasePainter) {

    this.basic.forEach((tileId: uint, idx: index) => {
      if (tileId === 0) return;
      //todo add filter not draw tiles
      const posX = idx % this.width + this.offsetX;
      const posY = Math.floor(idx / this.width) + this.offsetY;

      this.drawTile(p, tileId, toX(posX), toY(posY));
      // p.text("" + posX + ";" + posY, toX(posX), toY(posY), style.debugText)
    });

    this.objects.forEach((tileId: uint, idx: index) => {
      if (tileId === 0) return;
      const posX = idx % this.width + this.offsetX;
      const posY = Math.floor(idx / this.width) + this.offsetY;
      this.drawTile(p, tileId, toX(posX), toY(posY));
    });


    for (let pos = this.offsetX; pos < this.width; pos++) {
      p.vline(toX(pos), -SHIFT_Y, this.height * CELL, style.grid as StrokeStyle, false);
    }

    for (let pos = this.offsetY; pos < this.height; pos++) {
      p.hline(-SHIFT_X, this.width * CELL, toY(pos), style.grid as StrokeStyle, false);
    }
  }

  drawTile(p: BasePainter, tileId: uint, x: px, y: px) {
    if (x < -TILE_SIZE || y < -TILE_SIZE) return;
    if (x > p.width + TILE_SIZE || y > p.height + TILE_SIZE) return;

    const t = this.tiles.get(tileId);
    if (!t) return;

    const img = RES['map1'];
    p.ctx.drawImage(img, t.sx, t.sy, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
  }

  private toIndex(x: int, y: int): uint {
    return x - this.offsetX + (y - this.offsetY) * this.width;
  }

  private isValid(x: int, y: int): boolean {
    return x >= this.offsetX && x < (this.offsetX + this.width) && y >= this.offsetY && y < (this.offsetY + this.height);
  }
}