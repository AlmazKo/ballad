import { DateTimeFormatter } from '../util/DateTimeFormatter';

const INTERVALS: sec[] = [1, 5, 15, 30, 60, 300, 900, 1800, 3600, 7200, 21600, 43200, 86400];

export class TimeLine {
  private readonly fmt: DateTimeFormatter;
  private readonly minWidth: px;
  private readonly minInterval: number;
  private interval: sec = 1;

  constructor(fmt: DateTimeFormatter, minWidth: px, minInterval = 60) {
    if (INTERVALS.indexOf(minInterval) === -1) throw new Error('Wrong min period');

    this.fmt         = fmt;
    this.minWidth    = minWidth;
    this.minInterval = minInterval;
  }

  update(blockWidth: px, barSize: sec) {

    let interval = this.minWidth / blockWidth * barSize;

    let prev = this.minInterval;
    for (let i of INTERVALS) {
      if (interval > i) {
        prev = i;
      } else if (i >= this.minInterval) {
        this.interval = i;
        return;
      }
    }

    this.interval = prev;
  }

  private intervals: { [k: number]: (ts: ts) => boolean } = {
    7200 : ts => ts % 3600 === 0 && new Date(ts * 1000).getHours() % 2 === 0,
    21600: ts => ts % 3600 === 0 && new Date(ts * 1000).getHours() % 6 === 0,
    43200: ts => ts % 3600 === 0 && new Date(ts * 1000).getHours() % 12 === 0,
    86400: ts => ts % 3600 === 0 && new Date(ts * 1000).getHours() === 0
  };

  isEndInterval(ts: number): boolean {
    if (this.interval <= 3600) {
      return ts % this.interval === 0;
    } else {
      return this.intervals[this.interval](ts);
    }
  }

  format(ts: ts): string {
    if (this.interval < 60) {
      if (ts % 60 === 0) {
        return this.fmt.hm(ts);
      } else {
        return this.fmt.hms(ts);
      }

    } else if (this.interval >= 3600) {
      const dt = new Date(ts * 1000);
      if (dt.getHours() === 0) {
        return this.fmt.dayMonth(ts);
      } else {
        return this.fmt.hm(ts);
      }

    } else {
      return this.fmt.hm(ts);
    }
  }
}