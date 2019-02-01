import { toRGBA } from '../../canvas/utils';
import { Images } from '../../game2/Images';
import { get } from '../../Module';
import { BasePainter } from '../../draw/BasePainter';
import { Drawable } from '../Drawable';
import { BTN_1, BTN_2, BTN_3, Slot } from '../Slot';
import { Traits } from '../Trait';

export const RES = get<Images>('images');

export class Panels implements Drawable {
  private slots: Array<Slot | null> = [null, null, null, null, null];

  constructor() {
    this.slots[0] = new Slot(0, BTN_1, Traits.melee);
    this.slots[1] = new Slot(1, BTN_2, Traits.fireball);
    this.slots[2] = new Slot(2, BTN_3, Traits.fireshock);
  }

  draw(time: DOMHighResTimeStamp, p: BasePainter): void {

    const ctx = p.ctx;

    const [width, height] = [ctx.canvas.clientWidth, ctx.canvas.clientHeight];

    let x   = 60;
    const y = height - 45;
    for (let i = 0; i < 5; i++) {

      x = 60 + 60 * i;

      const slot = this.slots[i];
      if (slot) {
        const slotImg = RES.get(slot.trait.resName);
        if (slotImg)
          ctx.drawImage(slotImg, 0, 0, slotImg.width, slotImg.height, x - 25, y - 25, 50, 50);

        // if (this.coolDownFraction) {
        //   p.fill(toRGBA("#000", 0.66));
        //   ctx.beginPath();
        //   ctx.arc(x, y, 25, 1.5 * Math.PI, (1.5 + this.coolDownFraction * 2) * Math.PI, true);
        //   ctx.lineTo(x, y);
        //   ctx.fill();
        // }
      } else {
        p.fill(toRGBA("#000", 0.2));
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.fill();
      }


      // if (slot && this.lastRequestedAction === slot.trait && this.slotAnimatedFraction) {
      //   p.circle(x, y, 23.5, {style: "yellow", width: 4});
      // } else {
      //   p.circle(x, y, 25, {style: "white", width: 2});
      //
      // }

      if (slot && slot.key) {
        p.fillRect(x - 8, y + 17, 16, 16, "#cc0100");
        p.text(slot.key.name, x, y + 18, {align: 'center', font: "bold 12px sans-serif", style: "#fff"})
        ;
      }
    }
  }


}
