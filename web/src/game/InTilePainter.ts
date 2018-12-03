import { px } from '../types';
import { BasePainter } from '../draw/BasePainter';
import { FontStyle } from '../draw/FontStyleAcceptor';
import { Painter, StringStokeStyle } from '../draw/Painter';
import { FillStyle } from '../draw/FillStyle';
import { toX, toY } from './TilePainter';

export class InTilePainter implements Painter {

  currentX: px;
  currentY: px;

  constructor(private readonly bp: BasePainter) {
  }

  text(text: string, x: px, y: px, style?: Partial<FontStyle>, maxWidth?: px) {
    this.bp.text(text, this.currentX + x, this.currentY + y, style, maxWidth)
  }

  beginPath(startX: px, startY: px): CanvasPath {
    return undefined;
  }

  beginPath0(): CanvasPath {
    return this.bp.beginPath0();
  }

  circle(x: px, y: px, radius: px, style: StringStokeStyle): void {
  }

  clearArea(width: px, height: px): void {
  }

  closeFillPath(style: FillStyle): void {
  }

  closePath(strokeStyle: Partial<StringStokeStyle> | null, style: FillStyle | null): void {
  }

  closeStrokePath(strokeStyle: Partial<StringStokeStyle>): void {
  }

  debug(text: any, x: px, y: px): void {
  }

  fill(style: FillStyle): void {
  }

  fillCircle(x: px, y: px, radius: px, style?: FillStyle): void {
  }

  fillRect(x: px, y: px, w: px, h: px, style?: FillStyle, pixelPerfect?: boolean): void {
  }

  font(style?: FontStyle): void {
  }

  hline(x1: px, x2: px, y: px, style: StringStokeStyle): void {
  }

  line(x1: px, y1: px, x2: px, y2: px, style: StringStokeStyle): void {
  }

  measureHeight(style: FontStyle): px {
    return undefined;
  }

  measureWidth(text: string, style: FontStyle): px {
    return undefined;
  }

  rect(x: px, y: px, w: px, h: px, style: StringStokeStyle, pixelPerfect?: boolean): void {
  }

  stroke(strokeStyle: Partial<StringStokeStyle>): void {
  }

  vline(x: px, y1: px, y2: px, style: StringStokeStyle, pixelPerfect?: boolean): void {
  }

  ellipse(x: px, y: px, radiusX: px, radiusY: px, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean = false, style: StringStokeStyle): void {

    this.bp.stroke(style);
    this.bp.ctx.beginPath();
    this.bp.ctx.ellipse(this.currentX + x, this.currentY + y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
    this.bp.ctx.stroke();
  }



}
