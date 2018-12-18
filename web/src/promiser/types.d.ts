interface PromiseConstructor {
  of<T>(value: T): Promise<T>;

  zip<T1, T2, R>(v1: Promise<T1>, v2: Promise<T2>, accum: (p1: T1, p: T2) => R): Promise<R>;

  zip<T1, T2, T3, R>(v1: Promise<T1>, v2: Promise<T2>, v3: Promise<T3>, accum: (p1: T1, p2: T2, p3: T3) => R): Promise<R>;

  concat<T, R>(v1: Promise<T1>, v2: Promise<T2>, accum: (p1: T1, p: T2) => R): Promise<R>;

  timer(ms: number): Promise<void>;

  error(error: any): Promise<void>;

  never(): Promise<void>;
}

interface Promise<T> {
  map<FROM = T, TO>(transformer: (f: FROM) => TO): Promise<TO>;

  do<FROM = T>(consumer: (f: FROM) => void): Promise<T>;

  doOnError<FROM = T>(consumer: (error: any) => void): Promise<T>;

  delay<TO = T>(ms: number): Promise<TO>;

  timeout<TO = T>(ms: number): Promise<TO>;

  flatMap<TO>(mapper: (v: T) => Promise<TO>): Promise<TO>;

  retryWhen<TO = T>(mapper: (error: any) => Promise<TO>): Promise<TO>;
}