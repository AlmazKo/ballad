import { HCELL } from '../../game/constants';
import { RES } from '../../game/layers/GameCanvas';
import { Layer } from '../../game/layers/Layer';
import { Land } from '../engine/Land';
import { World } from '../engine/World';
import { Camera } from './Render';
import { TilesMng } from './TilesMng';


const TILE_SIZE: px    = 32;//fixme remove. take from api
const TILESET_SIZE: px = 23;//fixme remove. take from api


export class LandsLayer implements Layer {
  // @ts-ignore
  private ctx: CanvasRenderingContext2D;

  constructor(
    private readonly world: World,
    private readonly camera: Camera,
    private readonly tiles: TilesMng
  ) {

  }

  draw(time: DOMHighResTimeStamp) {


    this.world.iterateLands(this.camera.posX, this.camera.posY, 20, piece => {
      if (piece) {
        piece.data.forEach(land => this.drawTile(land))
      }
    })


  }


  drawTile(land: Land) {

    const img = RES.get('map1');
    if (!img) return;

    const x = this.camera.toX(land.x) - HCELL;
    const y = this.camera.toY(land.y) - HCELL;

    // if (x < -TILE_SIZE || y < -TILE_SIZE) return;
    // if (x > p.width + TILE_SIZE || y > p.height + TILE_SIZE) return;

    const b = this.tiles.get(land.basis);
    if (b) {
      this.ctx.drawImage(img, b.sx, b.sy, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
    }

  }

  changeSize(width: px, height: px): void {
  }

  init(ctx: CanvasRenderingContext2D, width: px, height: px): void {
    this.ctx = ctx;
  }
}
