import { BasePainter } from '../draw/BasePainter';
import { FillStyle } from '../draw/FillStyle';
import { FontStyle } from '../draw/FontStyleAcceptor';
import { Painter, StringStokeStyle } from '../draw/Painter';
import { CELL, coord, QCELL } from './constants';
import { InTilePainter } from './InTilePainter';
import { POS_X, POS_Y, SHIFT_X, SHIFT_Y } from './Lands';


export var toX: (pos: coord) => px = (pos: coord) => (pos - POS_X) * CELL - SHIFT_X;
export var toY: (pos: coord) => px = (pos: coord) => (pos - POS_Y) * CELL - SHIFT_Y;


export class TilePainter implements Painter {


  private readonly bp: BasePainter;
  private readonly bp2: InTilePainter;
  readonly ctx: CanvasRenderingContext2D;

  width: px;
  height: px;

  constructor(p: BasePainter) {
    this.bp     = p;
    this.bp2    = new InTilePainter(p);
    this.ctx    = p.ctx;
    this.width  = p.ctx.canvas.width;
    this.height = p.ctx.canvas.height;
  }


  drawTile(img: CanvasImageSource, sx: px, sy: px, sw: px, sh: px, posX: coord, posY: coord, shiftX: px = 0, shiftY: px = 0) {
    const x = toX(posX) + shiftX;
    const y = toY(posY) + shiftY;

    this.ctx.drawImage(img, sx, sy, sw, sh, x, y, sw, sh)
  }


  drawCenterTile(img: CanvasImageSource, sx: px, sy: px, sw: px, sh: px, posX: coord, posY: coord) {
    const x = posX * CELL + QCELL;
    const y = posY * CELL;

    this.ctx.drawImage(img, sx, sy, sw, sh, x, y, sw, sh)
  }

  toInTile(posX: coord, posY: coord, shiftX: px = 0, shiftY: px = 0): Painter {

    this.bp2.currentX = toX(posX) + shiftX;
    this.bp2.currentY = toY(posY) + shiftY;
    return this.bp2;
  }

  toInDirect(x: px, y: px): Painter {

    this.bp2.currentX = x;
    this.bp2.currentY = y;
    return this.bp2;
  }

  beginPath(startX: px, startY: px): CanvasPath {
    throw Error("Not implemented")
  }

  beginPath0(): CanvasPath {
    throw Error("Not implemented")
  }

  circle(x: px, y: px, radius: px, style: StringStokeStyle): void {
  }

  clearArea(width: px, height: px): void {
  }

  closeFillPath(style: FillStyle): void {
  }

  closePath(strokeStyle?: Partial<StringStokeStyle>, style?: FillStyle): void {
  }

  closeStrokePath(strokeStyle: Partial<StringStokeStyle>): void {
  }

  debug(text: any, x: px, y: px): void {
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
  }

  fill(style: FillStyle): void {
  }

  fillCircle(x: px, y: px, radius: px, style?: FillStyle): void {
  }

  fillRect(x: px, y: px, w: px, h: px, style?: FillStyle, pixelPerfect?: boolean): void {
    this.bp.fillRect(x, y, w, h, style, pixelPerfect)
  }

  fillAbsRect(x1: px, y1: px, x2: px, y2: px, style?: FillStyle, pixelPerfect?: boolean): void {
    this.bp.fillRect(x1, y1, x2 - x1, y2 - y1, style, pixelPerfect)
  }

  font(style?: FontStyle): void {
  }

  hline(x1: px, x2: px, y: px, style: StringStokeStyle): void {
  }

  line(x1: px, y1: px, x2: px, y2: px, style: StringStokeStyle): void {
  }

  measureHeight(style: FontStyle): px {
    return 0;
  }

  measureWidth(text: string, style: FontStyle): px {
    return 0;
  }

  rect(x: px, y: px, w: px, h: px, style: StringStokeStyle, pixelPerfect?: boolean): void {
  }

  stroke(strokeStyle: Partial<StringStokeStyle>): void {
  }

  text(text: string, x: px, y: px, style?: Partial<FontStyle>, maxWidth?: px): void {
    this.bp.text(text, x, y, style, maxWidth)
  }

  vline(x: px, y1: px, y2: px, style: StringStokeStyle, pixelPerfect?: boolean): void {
  }
}
