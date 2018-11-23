import { BasePainter } from '../draw/BasePainter';

export interface Drawable {

  draw(time: DOMHighResTimeStamp, bp: BasePainter): void
}
