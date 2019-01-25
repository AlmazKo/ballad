export interface Layer {
  init(ctx: CanvasRenderingContext2D, width: px, height: px): void;

  changeSize(width: px, height: px): void;
}
