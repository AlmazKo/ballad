Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

Array.prototype.contains = function <T>(val: T): boolean {
  return this.indexOf(val) !== -1;
};

Array.prototype.last = function <T>(): T {
  return this[this.length - 1];
};

Array.prototype.first = function <T>(): T {
  return this[0];
};

Array.prototype.remove = function <T>(e: T) {
  const idx = this.indexOf(e);
  if (idx < 0) return false;

  delete this[idx];
  return true;
};
