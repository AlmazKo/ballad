import { CanvasContext } from '../../draw/CanvasContext';
import { Layer } from '../../game/layers/Layer';
import { Images } from '../Images';
import { floor, Piece, World } from '../world/World';
import { Camera } from './Camera';


const ratio                            = 2;
const CELL                             = 32 * ratio;
const PIECE_SIZE: px                   = 512;//fixme remove. take from api
const TILE_SIZE: px                    = 32;//fixme remove. take from api
const TILESET_SIZE: px                 = 23;//fixme remove. take from api
const offCanvas                        = new (window as any).OffscreenCanvas(PIECE_SIZE * ratio, PIECE_SIZE * ratio) as any;
const offCtx: CanvasRenderingContext2D = offCanvas.getContext('2d', {alpha: true})!!;
offCtx.imageSmoothingEnabled           = false;
offCtx.imageSmoothingQuality           = "high";
const ctx                              = new CanvasContext(offCtx);


ctx.fillRect(0, 0, PIECE_SIZE, PIECE_SIZE, '#999');
ctx.text("NO DATA", PIECE_SIZE, PIECE_SIZE, {style: '#ccc', font: "bold 60px sans-serif", align: "right", baseline: "bottom"});

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

        if (img) this.ctx.ctx.drawImage(img, 0, 0, PIECE_SIZE * ratio, PIECE_SIZE * ratio, x, y, PIECE_SIZE, PIECE_SIZE);

        // this.ctx.rect(x, y, 1024, 1024, {style: 'black'});

        // this.ctx.text(`${piece.x}x${piece.y}`, x + 2, y + 2, {style: 'red'});

      }
    });
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

      //
      ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE, x, y, CELL, CELL);
      ctx.rect(x, y, CELL, CELL, {style: '#000000', dash: [1, 4]});
      // ctx.text("" + debugTile(land.type), x + 1, y + 1, {style: 'black'});
      // ctx.text(x + "", x + 1, y + 1, {style: 'black'});
    }

    return offCanvas.transferToImageBitmap();
  }

  changeSize(width: px, height: px): void {
  }

  init(ctx: CanvasContext): void {
    this.ctx = ctx;
  }
}
