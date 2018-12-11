import { CanvasComposer } from '../canvas/CanvasComposer';
import { int, px, uint } from '../types';
import { BasePainter } from '../draw/BasePainter';
import { ajax, WS_HOST } from '../util/net';
import { coord } from '../game/types';
import { ViewMap } from '../game/api/ViewMap';

const PAD = 20;

const CELL                    = 12;
const toX: (pos: coord) => px = (pos: coord) => PAD + pos * CELL;
const toY: (pos: coord) => px = (pos: coord) => PAD + pos * CELL;

export class AdminCanvas implements CanvasComposer {

  // @ts-ignore
  height: px;
  // @ts-ignore
  width: px;

  // @ts-ignore
  private p: BasePainter;
  private ws: WebSocket;
  private creatures: int[] = [];
  private npcs             = 0;
  private players          = 0;
  private map?: ViewMap;


  constructor() {
    this.ws           = new WebSocket(WS_HOST + '/admin');
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data));
    ajax('/map', map => this.map = map)
  }

  private onRawData(data: any) {
    this.creatures = data as int[];

    this.npcs    = this.creatures.filter(c => c > 1000).length;
    this.players = this.creatures.filter(c => c > 0 && c < 1000).length;

  }

  changeSize(width: px, height: px): void {
    this.width  = width;
    this.height = height;
  }

  destroy(): void {
  }

  init(ctx: CanvasRenderingContext2D, width: px, height: px): void {
    this.width  = width;
    this.height = height;
    this.p      = new BasePainter(ctx);
  }

  onEndFrame(time: DOMHighResTimeStamp, error?: Error): void {
  }

  onFrame(time: DOMHighResTimeStamp, frameId?: uint): void {
    this.p.clearArea(this.width, this.height);
    this.draw();
  }

  private draw() {

    if (!this.map) return;

    const m = this.map;

    const p     = this.p;
    const width = m.width * CELL;

    this.creatures.forEach((c, i) => {
      if (c < 1000) return;

      const x = i % m.width;
      const y = Math.floor(i / m.width);
      p.fillRect(toX(x) + 3, toY(y) + 3, CELL - 5, CELL - 5, "#9dc69d");
    });

    this.creatures.forEach((c, i) => {
      if (c < 1 || c >= 1000) return;

      const x = i % m.width;
      const y = Math.floor(i / m.width);
      p.fillRect(toX(x), toY(y), CELL, CELL, "#9d0508");
      p.text("" + c, toX(x) + CELL / 2, toY(y) + 2, {align: "center", font: "bold 10px sans-serif", style: "#fff",});
      p.fillRect(toX(x) - 8 * CELL, toY(y) - 8 * CELL, CELL * 17, CELL * 17, "#9d050833");
    });


    for (let pos = 0; pos < m.width; pos++) {
      p.vline(toX(pos), PAD, toY(m.height), {style: "#22222222"});
      p.text("" + (pos + m.offsetX), toX(pos) + 2, 0, {align: "left", font: "7px sans-serif"});
    }

    for (let pos = 0; pos < m.height; pos++) {
      p.hline(PAD, width + PAD, toY(pos), {style: "#22222222"});
      p.text("" + (pos + m.offsetY), PAD - 2, toX(pos) + 2, {align: "right", font: "7px sans-serif"});
    }

    p.vline(toX(m.width), PAD, toY(m.height), {style: "#22222222"});
    p.hline(PAD, width + PAD, toY(m.height), {style: "#22222222"});


    p.text('Mobs: ' + this.npcs, 2, toY(m.height) + 10, {align: "left", font: "12px sans-serif"});
    p.text('Players: ' + this.players, 2, toY(m.height) + 25, {align: "left", font: "12px sans-serif"});
  }
}