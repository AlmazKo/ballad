import { CanvasContext } from '../../draw/CanvasContext';
import { Layer } from '../../game/layers/Layer';
import { debugTile } from '../constants';
import { Images } from '../Images';
import { floor, Piece, World } from '../world/World';
import { Camera } from './Camera';
import { CELL } from './constants';


const PIECE_SIZE: px                   = 1024;//fixme remove. take from api
const TILE_SIZE: px                    = 32;//fixme remove. take from api
const TILESET_SIZE: px                 = 23;//fixme remove. take from api
const offCanvas                        = new (window as any).OffscreenCanvas(PIECE_SIZE, PIECE_SIZE) as any;
const offCtx: CanvasRenderingContext2D = offCanvas.getContext('2d', {alpha: true})!!;
offCtx.imageSmoothingEnabled           = false;
offCtx.imageSmoothingQuality           = "high";
const ctx                              = new CanvasContext(offCtx);


ctx.fillRect(0, 0, PIECE_SIZE, PIECE_SIZE, '#999');
ctx.text("NO DATA", 512, 512, {style: '#ccc', font: "bold 60px sans-serif", align: "right", baseline: "bottom"});

const NO_DATA: ImageBitmap = offCanvas.transferToImageBitmap();


export class LandsLayer implements Layer {

  // @ts-ignore
  private ctx: CanvasContext;
  private cache = new Map<any, ImageBitmap>();

  constructor(
    private readonly world: World,
    private readonly images: Images,
  ) {

  }

  draw(time: DOMHighResTimeStamp, camera: Camera) {

    this.world.iterateLands(camera.x, camera.y, 20, piece => {

      if (piece) {
        const img = this.getPieceImage(piece);
        const x   = camera.toX(piece.x);
        const y   = camera.toY(piece.y);
        if (img) this.ctx.ctx.drawImage(img, 0, 0, PIECE_SIZE, PIECE_SIZE, x, y, 1024, 1024);
        this.ctx.rect(x, y, PIECE_SIZE, PIECE_SIZE, {style: 'black'});

        this.ctx.text(`${piece.x}x${piece.y}`, x + 2, y + 2, {style: 'red'});

      }
    });


    const x = camera.toX(camera.x);
    const y = camera.toY(camera.y);

    this.ctx.rect(x, y, CELL, CELL, {style: 'red'});
    this.ctx.text(`${camera.x};${camera.y}`, x + 2, y + 2, {style: 'red'});
  }

  getPieceImage(piece: Piece): ImageBitmap {
    // return NO_DATA;
    const tileSet = this.images.get('map1');
    if (!tileSet || piece.data.length == 0) return NO_DATA;

    let img = this.cache.get(piece);

    if (img === undefined) {
      img = this.renderPiece2(piece, tileSet);
      if (img === undefined) return NO_DATA;
      this.cache.set(piece, img);
    }

    return img;
  }

  private renderPiece2(piece: Piece, img: HTMLImageElement): ImageBitmap | undefined {
    ctx.clear();

    for (let i = 0; i < piece.data.length; i++) {
      const land = piece.data[i];

      const x = (i % 16) * CELL;
      const y = floor(i / 16) * CELL;


      const tileX = land.tileId % TILESET_SIZE;
      const tileY = Math.floor(land.tileId / TILESET_SIZE);
      const sx    = TILE_SIZE * tileX;
      const sy    = TILE_SIZE * tileY;


      ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
      ctx.rect(x, y, CELL, CELL, {style: '#000000', dash: [1, 4]});
      ctx.text("" + debugTile(land.type), x + 1, y + 1, {style: 'black'});
    }

    return offCanvas.transferToImageBitmap();
  }

  changeSize(width: px, height: px): void {
  }

  init(ctx: CanvasContext): void {
    this.ctx = ctx;
  }
}
