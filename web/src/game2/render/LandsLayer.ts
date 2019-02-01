import { CanvasContext } from '../../draw/CanvasContext';
import { Layer } from '../../game/layers/Layer';
import { Images } from '../Images';
import { Land } from '../world/Land';
import { World } from '../world/World';
import { Camera } from './Camera';
import { CELL, HCELL } from './constants';

import { TilesMng } from './TilesMng';


const TILE_SIZE: px    = 32;//fixme remove. take from api
const TILESET_SIZE: px = 23;//fixme remove. take from api


export class LandsLayer implements Layer {

  // @ts-ignore
  private ctx: CanvasContext;

  constructor(
    private readonly world: World,
    private readonly tiles: TilesMng,
    private readonly images: Images,
  ) {

  }

  draw(time: DOMHighResTimeStamp, camera: Camera) {


    this.world.iterateLands(camera.x, camera.y, 20, piece => {
      if (piece) {
        piece.data.forEach(land => this.drawTile(land, camera))


        const x = camera.toX(piece.x);
        const y = camera.toY(piece.y);

        this.ctx.rect(x, y, CELL*16, CELL*16, {style: 'black'});
        this.ctx.text(`${piece.x}x${piece.y}`, x+1, y+1, {style: 'red'});
      }



    });


    const x = camera.toX(camera.x) - HCELL;
    const y = camera.toY(camera.y) - HCELL;

    this.ctx.rect(x, y, CELL, CELL, {style: 'red'})

  }


  drawTile(land: Land, camera: Camera) {

    const img = this.images.get('map1');
    if (!img) return;

    const x = camera.toX(land.x);
    const y = camera.toY(land.y);


    // if (x < -TILE_SIZE || y < -TILE_SIZE) return;
    // if (x > p.width + TILE_SIZE || y > p.height + TILE_SIZE) return;

    const b = this.tiles.get(land.basis-1);
    if (b) {
      this.ctx.drawImage(img, b.sx, b.sy, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
      this.ctx.rect(x, y, CELL, CELL, {style: 'grey', dash:[2,4]})
    }
      this.ctx.text("" +land.basis, x+1, y+1, {style: 'black'})

  }

  changeSize(width: px, height: px): void {
  }

  init(ctx: CanvasContext): void {
    this.ctx = ctx;
  }
}
