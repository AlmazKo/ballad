export class Extremum {
  min: number;
  max: number;

  constructor(min = NaN, max = NaN) {
    this.min = min;
    this.max = max;
  }

  equals(e: Extremum) {
    return (isNaN(this.min) && isNaN(this.max) && isNaN(e.max) && isNaN(e.min)) || e.min === this.min && e.max === this.max;
  }

  isUndefined() {
    return isNaN(this.min) || isNaN(this.max);
  }

  /** @return {boolean} */
  isPoint() {
    return this.min === this.max;
  }

  extend(value: number) {
    this.min -= value;
    this.max += value;
  }

  include(value: number): boolean {
    if (value === undefined) return false;
    return value >= this.min && value <= this.max;
  }

  /**
   *
   * @param {number} value
   * @return {boolean}
   */
  out(value: number) {
    if (value === undefined) return true;
    return value < this.min || value > this.max;
  }

  /**
   * @param {number} v
   */
  update(v: number) {
    if (isNaN(this.min) || v < this.min) this.min = v;
    if (isNaN(this.max) || v > this.max) this.max = v;
  }

  /**
   *
   * @return {Extremum}
   */
  copy() {
    return new Extremum(this.min, this.max);
  }

  /**
   * @return {number}
   */
  diff() {
    return this.max - this.min;
  }


  toString() {
    return `[${this.min};${this.max}]`;
  }
}