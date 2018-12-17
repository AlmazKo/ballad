export type StrokeJoinType = 'bevel' | 'round' | 'miter'

export interface StrokeStyle {
  style: string | CanvasGradient;
  width: px;
  join: StrokeJoinType;
  dash: [px, px]
}

export class StrokeStyleAcceptor {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly baseColor: color;

  private readonly handlers: { [K in keyof StrokeStyle]: (v: StrokeStyle[K]) => void } = {
    style: (v: string | CanvasGradient) => this.ctx.strokeStyle = v,
    width: (v: px) => this.ctx.lineWidth = v,
    join : (v: StrokeJoinType) => this.ctx.lineJoin = v,
    dash : (v: [px, px]) => this.ctx.setLineDash(v)
  };

  constructor(ctx: CanvasRenderingContext2D, baseColor: color = '#000') {
    this.ctx = ctx;
    this.baseColor = baseColor;
  }

  private setBase() {
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = this.baseColor;
    this.ctx.lineWidth = 1;
    this.ctx.lineJoin = 'miter';
  };

  set(style: Partial<StrokeStyle> | string) {
    this.setBase();

    if (!style) return;

    if (typeof style === 'string') {
      this.ctx.strokeStyle = style;
    } else {
      for (let key in style) {
        (<any>this.handlers)[key]((<any>style)[key]);
      }
    }
  }
}