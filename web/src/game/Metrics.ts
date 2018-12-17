import { ApiMetrics } from './api/ApiMetrics';

export class Metrics {
  maxLife: int;
  life: int;
  readonly name: string;

  constructor(m: ApiMetrics) {
    this.maxLife = m.life;
    this.life    = m.life;
    this.name    = m.name;
  }

}