Promise.prototype.map = function <F, T>(transformer: (f: F) => T): Promise<T> {
  return this.then((from: F) => transformer(from))
};

Promise.prototype.do = function <T>(handler: (f: T) => void): Promise<T> {
  return this.then((from: T) => {
    handler(from);
    return this;
  })
};

Promise.prototype.doOnError = function <T>(consumer: (error: any) => void): Promise<T> {
  return this.then(() => this, (err: any) => {
    consumer(err);
    return this;
  })
};

Promise.prototype.delay = function <T>(time: number): Promise<T> {
  return this.then((from: T) => Promise.timer(time).then(() => from))
};

Promise.prototype.timeout = function <T>(time: number): Promise<T> {
  const timer = Promise.timer(time).flatMap(() => Promise.error("Timeout error"));
  return Promise.race([this, timer])
};

Promise.prototype.flatMap = function <T, TO>(mapper: (v: T) => Promise<TO>): Promise<TO> {
  return this.then((from: T) => mapper(from))
};

Promise.prototype.onErrorResume = function <T, TO>(mapper: (v: T) => Promise<TO>): Promise<TO> {
  return this.catch((from: T) => mapper(from))
};

Promise.prototype.ignore = function (): Promise<void> {
  return this.then(() => Promise.resolve());
};

Promise.constructor.prototype.of = function <T>(value: T): Promise<T> {
  return Promise.resolve(value)
};

Promise.error = function <T>(error: any): Promise<T> {
  return Promise.reject(error)
};

Promise.constructor.prototype.never = function (): Promise<void> {
  return new Promise(() => {
  })
};

Promise.constructor.prototype.zip = function <T1, T2, T3, R>(v1: Promise<T1>, v2: Promise<T2>, v3: Promise<T3>, accum: (t1: T1, t2: T2, t3: T3) => NP<R>): Promise<R> {
  const all: Promise<[T1, T2, T3]> = Promise.all<T1, T2, T3>([v1, v2, v3]);

  return all.map((x: [T1, T2, T3]) => accum(x[0], x[1], x[2]));
};


Promise.constructor.prototype.timer = function (ms: number): Promise<void> {

  if (ms < 0) throw new Error("Negative timer");

  if (!ms) {
    return Promise.resolve();
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), ms)
    });
  }

};