import { hround, round } from '../canvas/utils';
import { StrokeStyleAcceptor } from './StrokeStyleAcceptor';
import { FontStyle, FontStyleAcceptor } from './FontStyleAcceptor';
import { color, px } from '../types';
import { FillStyle } from './FillStyle';
import { Painter, StringStokeStyle } from './Painter';

export class BasePainter implements Painter {
  readonly ctx: CanvasRenderingContext2D;
  private readonly strokeAcceptor: StrokeStyleAcceptor;
  private readonly fontAcceptor: FontStyleAcceptor;
  private readonly baseFillColor: FillStyle;

  private hMeasuringCache: { [key: string]: px | undefined } = {};
  width: number;
  height: number;

  constructor(ctx: CanvasRenderingContext2D, baseColor: color = '#000', baseFillColor: color = '#fff') {
    this.ctx            = ctx;
    this.baseFillColor  = baseFillColor;
    this.strokeAcceptor = new StrokeStyleAcceptor(ctx, baseColor);
    this.fontAcceptor   = new FontStyleAcceptor(ctx, baseColor);
    this.width          = ctx.canvas.width;
    this.height         = ctx.canvas.height;
  }

  /**
   * Draw a vertical line
   */
  vline(x: px, y1: px, y2: px, style: StringStokeStyle, pixelPerfect = true) {

    this.stroke(style);
    if (pixelPerfect && this.ctx.lineWidth % 2 === 1) {
      x = hround(x);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(x, y1);
    this.ctx.lineTo(x, y2);
    this.ctx.stroke();
  }

  /**
   * Draw a horizontal line
   */
  hline(x1: px, x2: px, y: px, style: StringStokeStyle, pixelPerfect = true) {

    this.stroke(style);
    if (pixelPerfect && this.ctx.lineWidth % 2 === 1) {
      y = hround(y);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y);
    this.ctx.lineTo(x2, y);
    this.ctx.stroke();
  }

  /**
   * Draw a line
   */
  line(x1: px, y1: px, x2: px, y2: px, style: StringStokeStyle) {
    this.stroke(style);

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);

    this.ctx.stroke();
  }

  /**
   * Draw a stroke rectangle
   */
  rect(x: px, y: px, w: px, h: px, style: StringStokeStyle, pixelPerfect = true) {
    this.stroke(style);
    if (pixelPerfect && this.ctx.lineWidth % 2 === 1) {
      x = hround(x);
      y = hround(y);
    }
    this.ctx.strokeRect(x, y, w, h);
  }

  fillRect(x: px, y: px, w: px, h: px, style?: FillStyle, pixelPerfect = true) {
    this.fill(style);

    if (pixelPerfect) {
      this.ctx.fillRect(round(x), round(y), round(w), round(h));
    } else {
      this.ctx.fillRect(x, y, w, h);
    }
  }

  fillCircle(x: px, y: px, radius: px, style?: FillStyle) {
    if (radius < 0.5) radius = 0.5;
    this.fill(style);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  circle(x: px, y: px, radius: px, style: StringStokeStyle) {
    if (radius < 0.5) radius = 0.5;
    this.stroke(style);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  text(text: string, x: px, y: px, style?: Partial<FontStyle>, maxWidth?: px) {
    this.fontAcceptor.set(style);
    /* IE doesn't work without max width param */
    this.ctx.fillText(text, x, y, maxWidth || 1000);
  }

  debug(text: any, x: px, y: px) {
    this.text('' + text, x, y);
  }

  clearArea(width: px, height: px) {
    this.ctx.clearRect(0, 0, width, height);
  }

  measureHeight(style: FontStyle): px {
    const styleHash    = JSON.stringify(style);
    const cachedHeight = this.hMeasuringCache[styleHash];

    if (cachedHeight) {
      return cachedHeight;
    }

    const span = document.createElement('span');

    /* geometry */
    span.style.position = 'absolute';
    span.style.top      = '100px';
    span.style.left     = '100px';

    /* font style */
    span.style.color = style.style!;
    span.style.font  = style.font!;

    span.appendChild(document.createTextNode('Аy'));
    document.body.appendChild(span);

    const h = parseInt(window.getComputedStyle(span).height || '');

    document.body.removeChild(span);

    this.hMeasuringCache[styleHash] = h;

    return h;
  }

  measureWidth(text: string, style: FontStyle): px {
    this.fontAcceptor.set(style);
    return this.ctx.measureText(text).width;
  }

  stroke(strokeStyle: Partial<StringStokeStyle>) {
    if (!strokeStyle) {
      console.warn('Try to set empty style');
    }

    this.strokeAcceptor.set(strokeStyle);
  }

  fill(style?: FillStyle) {
    if (style) this.ctx.fillStyle = style;
  }

  font(style?: FontStyle) {
    this.fontAcceptor.set(style);
  }

  beginPath(startX: px, startY: px): CanvasPath {
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    return this.ctx;
  }


  closePath(strokeStyle?: Partial<StringStokeStyle>, style?: FillStyle) {

    if (strokeStyle) {
      this.closeStrokePath(strokeStyle)
    }
    if (style) {
      this.closeFillPath(style)
    }
  }

  closeFillPath(style: FillStyle) {

    this.ctx.fillStyle = style;
    this.ctx.closePath();
    this.ctx.fill();
  }

  beginPath0(): CanvasPath {
    this.ctx.beginPath();
    return this.ctx;
  }

  closeStrokePath(strokeStyle: Partial<StringStokeStyle>): void {
    this.stroke(strokeStyle);
    this.ctx.stroke();
  }

  ellipse(x: px, y: px, radiusX: px, radiusY: px, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
  }
}