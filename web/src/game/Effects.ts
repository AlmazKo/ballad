import { Effect } from './Effect';
import { TileDrawable } from './TileDrawable';
import { TilePainter } from './TilePainter';

export class Effects implements TileDrawable {
  private effects = [] as Array<Effect>;

  push(effect: Effect) {
    this.effects.push(effect)
  }

  find(spellId: uint): Effect | undefined {
    return this.effects.find(e => e.id == spellId);
  }

  draw(time: DOMHighResTimeStamp, p: TilePainter) {

    this.effects.forEach(it => {
      it.draw(time, p)
    });

    //fixme optimize?
    this.effects = this.effects.filter(b => !b.isFinished)
  }
}