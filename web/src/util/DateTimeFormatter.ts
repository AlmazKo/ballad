import { Locale, ms, ts, tsm } from 'types';

function prepare(dt: Date | tsm): Date | ms {
  if (typeof dt === 'number' && dt < 10000000000) {
    dt *= 1000;
  }
  return dt;
}

export class DateTimeFormatter {
  private hmsFmt: Intl.DateTimeFormat;
  private hmFmt: Intl.DateTimeFormat;
  private dmyFmt: Intl.DateTimeFormat;
  private dmyhmsFmt: Intl.DateTimeFormat;
  private dFmt: Intl.DateTimeFormat;
  private dhmsFmt: Intl.DateTimeFormat;
  private dayMFmt: Intl.DateTimeFormat;
  private hFmt: Intl.DateTimeFormat;
  private mFmt: Intl.DateTimeFormat;

  constructor(locale: Locale) {
    this.hmsFmt    = new Intl.DateTimeFormat(locale, {
      hour  : 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    this.hmFmt     = new Intl.DateTimeFormat(locale, {
      hour  : 'numeric',
      minute: 'numeric'
    });
    this.dmyFmt    = new Intl.DateTimeFormat(locale, {
      day  : 'numeric',
      month: 'numeric',
      year : 'numeric'
    });
    this.dmyhmsFmt = new Intl.DateTimeFormat(locale, {
      day   : 'numeric',
      month : 'numeric',
      year  : 'numeric',
      hour  : 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    this.hFmt      = new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
    });
    this.mFmt      = new Intl.DateTimeFormat(locale, {
      minute: 'numeric'
    });
    this.dFmt      = new Intl.DateTimeFormat(locale, {
      day: '2-digit'
    });
    this.dhmsFmt   = new Intl.DateTimeFormat(locale, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
    });

    this.dayMFmt = new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'short'});
  }

  d(date: Date | tsm | ts): string {
    return this.dFmt.format(prepare(date));
  }

  h(date: Date | tsm | ts): string {
    return this.hFmt.format(prepare(date));
  }

  m(date: Date | tsm | ts): string {
    return this.mFmt.format(prepare(date));
  }

  hms(date: Date | tsm | ts): string {
    return this.hmsFmt.format(prepare(date));
  }

  dhms(date: Date | tsm | ts): string {
    return this.dhmsFmt.format(prepare(date));
  }

  hm(date: Date | tsm | ts): string {
    return this.hmFmt.format(prepare(date));
  }

  dmyhms(date: Date | tsm | ts, deprecated?: boolean): string {
    return this.dmyhmsFmt.format(prepare(date));
  }

  dmy(date: Date | tsm | ts, deprecated?: boolean): string {
    return this.dmyFmt.format(prepare(date));
  }

  dayMonth(date: Date | ts): string {
    return this.dhmsFmt.format(prepare(date));
  }

}