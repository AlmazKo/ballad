import { CanvasContext } from '../../draw/CanvasContext';

export interface Layer {
  init(ctx: CanvasContext): void;

  changeSize(width: px, height: px): void;
}
