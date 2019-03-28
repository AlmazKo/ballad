declare type NP<T> = Exclude<T, Promise<any>>;

interface PromiseConstructor {
  of<T>(value: NP<TO>): Promise<T>;

  // zip<T1, T2, R>(v1: Promise<T1>, v2: Promise<T2>, accum: (p1: T1, p: T2) => R): Promise<R>;
  //
  // zip<T1, T2, T3, R>(v1: Promise<T1>, v2: Promise<T2>, v3: Promise<T3>, accum: (p1: T1, p2: T2, p3: T3) => R): Promise<R>;

  timer(ms: number): Promise<void>;

  error<T>(error: any): Promise<T>;

  never(): Promise<void>;
}

interface Promise<T extends NP<T>> {
  map<FROM = T, TO>(transformer: (f: FROM) => NP<TO>): Promise<TO>;

  do<FROM = T>(consumer: (f: FROM) => void): Promise<T>;

  doOnError<FROM = T>(consumer: (error: any) => void): Promise<T>;

  onErrorResume<FROM = T>(consumer: (error: any) => Promise<T>): Promise<T>;

  delay<TO = T>(ms: number): Promise<TO>;

  ignore(): Promise<void>;

  timeout<TO = T>(ms: number): Promise<TO>;

  flatMap<TO>(mapper: (v: T) => Promise<TO>): Promise<TO>;
}
