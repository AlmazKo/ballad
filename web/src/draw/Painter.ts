import { FontStyle } from './FontStyleAcceptor';
import { StrokeStyle } from './StrokeStyleAcceptor';

export type StringStokeStyle = color | Partial<StrokeStyle>;
type FillStyle = color | CanvasGradient | CanvasPattern;


export interface Painter {
  /**
   * Draw a vertical line
   */
  vline(x: px, y1: px, y2: px, style: StringStokeStyle, pixelPerfect?: boolean): void

  /**
   * Draw a horizontal line
   */
  hline(x1: px, x2: px, y: px, style: StringStokeStyle): void


  /**
   * Draw a line
   */
  line(x1: px, y1: px, x2: px, y2: px, style: StringStokeStyle): void

  /**
   * Draw a stroke rectangle
   */
  rect(x: px, y: px, w: px, h: px, style: StringStokeStyle, pixelPerfect?: boolean): void

  fillRect(x: px, y: px, w: px, h: px, style?: FillStyle, pixelPerfect?: boolean): void

  fillCircle(x: px, y: px, radius: px, style?: FillStyle): void

  circle(x: px, y: px, radius: px, style: StringStokeStyle): void

  ellipse(x: px, y: px, radiusX: px, radiusY: px, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean, style: StringStokeStyle): void;

  text(text: string, x: px, y: px, style?: Partial<FontStyle>, maxWidth?: px): void

  debug(text: any, x: px, y: px): void

  clearArea(width: px, height: px): void

  measureHeight(style: FontStyle): px

  measureWidth(text: string, style: FontStyle): px

  stroke(strokeStyle: Partial<StringStokeStyle>): void

  fill(style?: FillStyle): void

  font(style?: FontStyle): void

  beginPath(startX: px, startY: px): CanvasPath

  beginPath0(): CanvasPath

  closeStrokePath(strokeStyle: Partial<StringStokeStyle>): void

  closeFillPath(style: FillStyle): void

  closePath(strokeStyle?: Partial<StringStokeStyle>, style?: FillStyle): void

}