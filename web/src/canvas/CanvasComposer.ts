export interface Support {
  drag: Draggable;
  zoom: ZoomChange;
  cursor: CursorChange;
  click: Clickable;
  pressable: Pressable;
}

export interface Draggable {
  drag(shiftX: px, shiftY: px): void;

  drop(shiftX: px, shiftY: px): void;
}


export interface Registrar {
  <K extends keyof Support>(type: K, target: Support[K]): void;
}

export interface ZoomChange {
  zoomIn(): void;

  zoomOut(): void;
}

export interface Clickable {
  click(): void;

  doubleClick(): void;
}

export interface Pressable {
  keydown(e: KeyboardEvent): void;

  keypress(e: KeyboardEvent): void;

  keyUp(e: KeyboardEvent): void;
}

export interface CursorChange {
  changeCursorPosition(pos?: [px, px]): void;
}

export interface CanvasComposer {

  width: px;
  height: px;

  register?(register: Registrar): void;

  init(ctx: CanvasRenderingContext2D, width: px, height: px): void;

  onFrame(time: DOMHighResTimeStamp, frameId?: uint): void;

  onEndFrame?(time: DOMHighResTimeStamp, error?: Error): void;

  changeSize(width: px, height: px): void;

  destroy(): void;
}



