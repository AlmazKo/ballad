export type FontAlignType = 'left' | 'right' | 'center' | 'start' | 'end';
//baseline explanation: {@link https://html.spec.whatwg.org/images/baselines.png}
export type FontBaselineType = 'top' | 'hanging' | 'middle' | 'alphabetic' | /*'ideographic' it isn't work in FF | */ 'bottom';

export interface FontStyle {
  size: px;
  font: string;
  align: FontAlignType;
  style: string;
  baseline: FontBaselineType;
}

export class FontStyleAcceptor {
  private ctx: CanvasRenderingContext2D;
  private baseColor: color;

  private handlers: { [K in keyof FontStyle]: (v: FontStyle[K]) => void } = {
    font    : (v: string) => this.ctx.font = v,
    size    : (v: px) => this.ctx.font = v + 'px',
    style   : (v: string) => this.ctx.fillStyle = v,
    align   : (v: FontAlignType) => this.ctx.textAlign = v,
    baseline: (v: FontBaselineType) => this.ctx.textBaseline = v
  };

  constructor(ctx: CanvasRenderingContext2D, baseColor: color = '#000') {
    this.ctx = ctx;
    this.baseColor = baseColor;
  }

  private setBase() {
    this.ctx.font = 'normal 10px Arial, Helvetica, Verdana, sans-serif';
    this.ctx.fillStyle = this.baseColor;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
  };

  set(style?: Partial<FontStyle>) {
    this.setBase();
    if (!style) return;

    for (let key in style) {
      (<any>this.handlers)[key]((<any>style)[key]);
    }
  }
}