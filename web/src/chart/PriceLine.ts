import { px } from "../types";
import { Extremum } from "./Extremum";

const PRICE_BORDERS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 10000000, 100000000, 1000000000];

export class PriceLine {
  private readonly precision: number;
  private readonly minHeight: px;

  constructor(precision: number, minHeight: px) {
    this.precision = precision;
    this.minHeight = minHeight;
  }

  calcDivider(ex: Extremum, totalHeight: px): number {

    const diff           = ex.diff();
    const minValueInPips = diff / totalHeight * this.minHeight * Math.pow(10, this.precision);
    const pips           = Math.pow(10, -this.precision);
    for (let i = 0; i < PRICE_BORDERS.length; i++) {
      if (minValueInPips > PRICE_BORDERS[i]) continue;
      return PRICE_BORDERS[i] * pips;
    }

    return 1;
  }
}