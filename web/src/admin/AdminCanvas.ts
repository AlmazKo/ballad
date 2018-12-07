import { CanvasComposer } from '../canvas/CanvasComposer';
import { int, px, uint } from '../types';
import { BasePainter } from '../draw/BasePainter';
import { WS_HOST } from '../util/net';
import { coord } from '../game/types';

const MAP_SIZE = 32;
const PAD      = 20;

const CELL                    = 16;
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


  constructor() {
    this.ws           = new WebSocket(WS_HOST + '/admin');
    this.ws.onmessage = (event) => this.onRawData(JSON.parse(event.data));
  }

  private onRawData(data: any) {
    this.creatures = data as int[]

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

    const p     = this.p;
    const width = MAP_SIZE * CELL;

    this.creatures.forEach((c, i) => {
      if (c < 1000) return;

      const x = i % MAP_SIZE;
      const y = Math.floor(i / MAP_SIZE);
      p.fillRect(toX(x) + 4, toY(y) + 4, CELL - 7, CELL - 7, "#9dc69d");
    });

    this.creatures.forEach((c, i) => {
      if (c < 1 || c >= 1000) return;

      const x = i % MAP_SIZE;
      const y = Math.floor(i / MAP_SIZE);
      p.fillRect(toX(x), toY(y), CELL, CELL, "#9d0508");
      p.text("" + c, toX(x) + CELL / 2, toY(y) + 2, {align: "center", font: "bold 10px sans-serif", style: "#fff",});
      p.fillRect(toX(x) - 8 * CELL, toY(y) - 8 * CELL, CELL * 17, CELL * 17, "#9d050833");
    });


    for (let pos = 0; pos < MAP_SIZE; pos++) {
      p.vline(toX(pos), PAD, width + PAD, {style: "#33333333"});
      p.hline(PAD, width + PAD, toY(pos), {style: "#33333333"});

      p.text("" + pos, toX(pos) + 2, 0, {align: "left", font: "10px sans-serif"});
      p.text("" + pos, 1, toY(pos), {align: "left", font: "10px sans-serif"});
    }

    p.vline(toX(MAP_SIZE), PAD, width + PAD, {style: "#44444444"});
    p.hline(PAD, width + PAD, toY(MAP_SIZE), {style: "#44444444"});


    p.text('Mobs: ' + this.npcs, 2, toY(MAP_SIZE) + 10, {align: "left", font: "10px sans-serif"});
    p.text('Players: ' + this.players, 2, toY(MAP_SIZE) + 25, {align: "left", font: "10px sans-serif"});
  }
}