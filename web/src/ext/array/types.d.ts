interface Array<T> {
  first: () => T;
  last: () => T;
  isEmpty: () => boolean;
  contains: (item: T) => boolean;
  remove: (item: T) => boolean;
}
