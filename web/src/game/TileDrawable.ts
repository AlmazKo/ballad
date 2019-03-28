import { TilePainter } from './TilePainter';

export interface TileDrawable {

  draw(time: DOMHighResTimeStamp, bp: TilePainter): void
}
