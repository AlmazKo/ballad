import { int } from '../types';

export class Metrics {
  maxLife: int;
  life: int;
  readonly name: string;

  constructor(life: int, name: string) {
    this.maxLife = life;
    this.life    = life;
    this.name    = name;
  }

}