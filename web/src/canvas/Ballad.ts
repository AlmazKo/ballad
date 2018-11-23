import { DOMHighResTimeStamp, px, uint } from '../types';
import { CanvasComposer, Clickable, CursorChange, Draggable, Pressable, Support, ZoomChange } from './CanvasComposer';

class FpsMeter {
  times = 0;
  prev  = 0;
  value = 0;

  update(now: number) {
    this.times++;
    if ((now - this.prev) > 1000) {
      this.value = this.times;
      this.times = 0;
      this.prev  = now;
    }
  }
}

let DEV       = true;//process.env.NODE_ENV === 'development';
let INC: uint = 0;

export class Ballad {
  private readonly container: Element;
  private readonly watchParent: boolean;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly maxFps: number;

  private stopped   = false;
  private paused    = false;
  private destroyed = false;

  private cursorPosition: [px, px] | null = null;
  private width: px;
  private height: px;
  private ratio: number;

  private composer: CanvasComposer;
  private draggable: Draggable | null;
  private zoom: ZoomChange | null;
  private position: CursorChange | null;
  private dblClick: Clickable | null;
  private pressable: Pressable | null;
  private id: number;

  constructor(container: HTMLElement, size: [px, px] | null = null, maxFps: number = 120) {

    this.id        = ++INC;
    this.maxFps    = maxFps;
    this.container = container;
    if (size) {
      this.watchParent = false;
      this.width       = size[0];
      this.height      = size[1];
    } else {
      const posStyle = window.getComputedStyle(container).getPropertyValue('position');
      if (posStyle !== 'absolute') {
        this.error('Parent container must have an absolute position, the fixed length will be used');
        this.watchParent = false;
        this.width       = 200;
        this.height      = 200;
      } else {
        this.watchParent = true;
        this.width       = container.clientWidth;
        this.height      = container.clientHeight;
      }
    }

    this.ratio  = window.devicePixelRatio ? Math.max(window.devicePixelRatio, 1) : 1;
    this.canvas = this.createCanvasElement();
    container.appendChild(this.canvas);
    const context = <CanvasRenderingContext2D>this.canvas.getContext('2d', {alpha: true});
    if (context === null) throw new Error('Fail create context');
    this.ctx = context;

    this.updateCanvasSize();
  }

  start(composer: CanvasComposer) {

    this.composer = composer;
    this.registAdditionalOpts(composer);
    this._registerEvents();

    this.log('Start');
    let frameId = 0;

    const fps     = new FpsMeter();
    const minStep = 1000 / this.maxFps;
    let prev      = 0;

    composer.init(this.ctx, this.width, this.height);

    const callback = (now: DOMHighResTimeStamp) => {
      if (this.destroyed) return;
      if (!this.canvas || !this.canvas.parentNode) {
        this.destroy();
        return;
      }

      //need for preventing calling previous callbacks
      //FIXME if (this.id !== this.inc) return;

      if (this.stopped || now - prev < minStep) {
        window.requestAnimationFrame(callback);
        return;
      }

      fps.update(now);
      this.detectChangeRatio();
      this.detectChangeSize();

      prev = now;

      try {
        composer.onFrame(now, frameId++);
        this.tryCallEndFrame(now);
      } catch (e) {
        this.error('Fail render the frame', e);
        this.tryCallEndFrame(now, e);
      }

      this.debugInfo(fps);
      window.requestAnimationFrame(callback);
    };

    window.requestAnimationFrame(callback);
  }

  private debugInfo(fps: FpsMeter) {
    this.ctx.font         = 'bold 16px sans-serif';
    this.ctx.fillStyle    = '#0f0';
    this.ctx.textAlign    = 'right';
    this.ctx.textBaseline = 'top';
    this.ctx.strokeStyle  = '#000';
    this.ctx.lineWidth    = 1;
    this.ctx.setLineDash([]);
    this.ctx.strokeText(fps.value + '', this.width - 2, 0);
    this.ctx.fillText(fps.value + '', this.width - 2, 0);

    //corners
    this.ctx.strokeRect(0.5, 0.5, 3, 3);
    this.ctx.strokeRect(this.width - 3.5, 0.5, 3, 3);
    this.ctx.strokeRect(0.5, this.height - 3.5, 3, 3);
    this.ctx.strokeRect(this.width - 3.5, this.height - 3.5, 3, 3);
  }

  private tryCallEndFrame(now: DOMHighResTimeStamp, renderError?: Error) {
    if (!this.composer.onEndFrame) return;

    try {
      this.composer.onEndFrame(now, renderError);
    } catch (e) {
      this.error('Fail render the end of frame', e);
    }
  }

  private registAdditionalOpts(composer: CanvasComposer) {
    if (!composer.register) return;

    composer.register(<K extends keyof Support>(trait: K, target: Support[K]) => {
      if (trait === 'drag') this.draggable = target as Draggable;
      if (trait === 'zoom') this.zoom = target as ZoomChange;
      if (trait === 'cursor') this.position = target as CursorChange;
      if (trait === 'click') this.dblClick = target as Clickable;
      if (trait === 'pressable') this.pressable = target as Pressable;
    });

  }

  resume() {
    this.stopped = false;
    this.log('Resume');
  }

  stop() {
    if (this.stopped || this.destroyed) return;

    this.stopped = true;
    this.log('Stop');
  }

  /**
   * @return {boolean}
   */
  isStopped() {
    return this.stopped;
  }

  destroy() {
    if (this.destroyed) return;
    this.stopped   = false;
    this.destroyed = true;
    this.composer.destroy();
    if (this.canvas.parentNode) {
      this.container.removeChild(this.canvas);
    }
    (this.container as any) = null;
    (this.canvas as any)    = null;

    this.log('Destroyed.');
  }

  pause() {
    if (this.paused) {
      this.log('Resume from pause');
    } else {
      this.log('CanvasComposer', this.composer);
      this.log('Pause');
    }
    this.paused = !this.paused;
  }

  /**
   * @return {HTMLCanvasElement}
   */
  private createCanvasElement(): HTMLCanvasElement {
    const canvas            = document.createElement('canvas');
    canvas.style.width      = this.width + 'px';
    canvas.style.height     = this.height + 'px';
    canvas.style.outline    = 'none';
    canvas.style.userSelect = 'none';
    return canvas;
  }

  private updateCanvasSize() {
    this.canvas.style.width  = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.canvas.width  = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.ctx.scale(this.ratio, this.ratio);

    if (this.ratio === 1) {
      this.log(`Canvas size is set: ${this.canvas.width}x${this.canvas.height}px, ratio: 1:1`);
    } else {
      this.log(
        `Canvas size is set: ${this.canvas.width}x${this.canvas.height},`,
        `real size: ${this.width}x${this.height}px`,
        `ratio: 1:${this.ratio}`
      );
    }
  }

  private _registerEvents() {

    if (this.position) {
      this.canvas.addEventListener('mousemove', e => this.setCursorPosition(e));
      this.canvas.addEventListener('mouseout', _ => this.setCursorPosition());
    }

    if (this.draggable) {
      this.canvas.addEventListener('mousedown', e => this.onMouseClick(e));
      this.canvas.style.cursor = 'pointer';
    }

    if (this.zoom) {
      this.canvas.addEventListener('wheel', e => this.onWheel(e));
    }

    if (this.dblClick) {
      this.canvas.addEventListener('dblclick', e => this.onDoubleClick(e));
    }

    if (this.pressable) {
      window.addEventListener('keypress', e => this.onKeypress(e));
      window.addEventListener('keyup', e => this.onKeyup(e));
      window.addEventListener('keydown', e => this.onKeydown(e));
    }
  }


  private onKeypress(e: KeyboardEvent) {
    // console.log('PRESS', e.key, e.keyCode)
    if (this.pressable) {
      this.pressable.keypress(e);
    }
  }

  private onKeyup(e: KeyboardEvent) {
    console.log('UP   ', e.key, e.keyCode)
    if (this.pressable) {
      this.pressable.keyUp(e);
    }
  }

  private onKeydown(e: KeyboardEvent) {
    console.log('DOWN ', e.key, e.keyCode)
    if (this.pressable) {
      this.pressable.keydown(e);
    }
  }


  private onWheel(e: WheelEvent) {
    if (!this.zoom) return;

    if (e.ctrlKey) {
      //detect zoom
      //add support for mac
      return;
    }

    e.preventDefault();

    // console.log('wheel', e.deltaY);
    if (e.deltaY < 1) {
      this.zoom.zoomIn();
    } else if (e.deltaY > 1) {
      this.zoom.zoomOut();
    }
    return false;
  }

  private onDoubleClick(e: MouseEvent) {
    if (!this.dblClick) return;

    this.dblClick.doubleClick();
  }

  private onMouseClick(e: MouseEvent) {
    if (!this.draggable) return;

    const initPos = this._getPosition(e);

    const move = (e: MouseEvent) => {
      const pos    = this._getPosition(e);
      const shiftX = pos[0] - initPos[0];
      this.draggable!.drag(shiftX, 0);
      e.preventDefault();  //for preventing selection
    };

    document.addEventListener('mousemove', move);
    this.canvas.style.cursor = 'ew-resize';
    let isMoving: boolean    = true;

    document.addEventListener('mouseup', (e: MouseEvent) => {
      if (!isMoving || !this.composer) return;
      document.removeEventListener('mousemove', move);
      isMoving = false;

      this.canvas.style.cursor = 'pointer';
      const endPos             = this._getPosition(e);
      const shiftX             = endPos[0] - initPos[0];
      const shiftY             = endPos[1] - initPos[1];
      if (shiftX !== 0) this.draggable!.drop(shiftX, 0);
      //this.debug(`Drag&Drop: ${initPos[0]}x${initPos[1]} → ${endPos[0]}x${endPos[1]}, shift: [x:${shiftX}, y: ${shiftY}]`);
    });
  }

  private setCursorPosition(e?: MouseEvent) {
    if (!this.position) return;
    if (e) {
      this.cursorPosition = this._getPosition(e);
      this.position.changeCursorPosition(this.cursorPosition);
    } else {
      this.cursorPosition = null;
      this.position.changeCursorPosition();
    }
  }

  /**
   * @param {Event} e
   */
  private _getPosition(e: MouseEvent): [px, px] {
    return [
      Math.round(e.clientX - this.canvas.getBoundingClientRect().left),
      Math.round(e.clientY - this.canvas.getBoundingClientRect().top)
    ];
  }

  private detectChangeSize() {
    const [newWidth, newHeight] = this.getActualSize();
    if (this.width === newWidth && this.height === newHeight) return;

    this.width  = newWidth;
    this.height = newHeight;
    this.updateCanvasSize();
    if (!this.composer || !this.composer.changeSize) return;

    this.composer.changeSize(this.width, this.height);
  }

  private getActualSize() {
    let newWidth,
        newHeight;
    if (this.watchParent) {
      newWidth  = this.container.clientWidth;
      newHeight = this.container.clientHeight;
    } else {
      newWidth  = this.container.clientWidth;
      newHeight = this.container.clientHeight;
    }
    return [newWidth, newHeight];
  }

  private detectChangeRatio() {
    const newRatio = window.devicePixelRatio;
    if (newRatio >= 1 && newRatio !== this.ratio) {
      this.resetScaling();
      this.ratio = newRatio;
      this.updateCanvasSize();
    }
  }

  private resetScaling() {
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  debug(...args: any[]) {
    if (DEV) console.debug('%cPlayer#' + this.id, 'color: blue', ...args);
  }

  log(...args: any[]) {
    if (DEV) console.log('%cPlayer#' + this.id, 'color: blue', ...args);
  }

  error(...args: any[]) {
    if (DEV) console.error('%cPlayer#' + this.id, 'color: blue', ...args);
  }

}