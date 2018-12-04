import { color, float, px } from '../types';

/**
 * Special for canvas x axis
 * Rounds to next *.5 value
 */
export function hround(v: px): px {
  const base = Math.ceil(v) + 0.5;
  return v + 0.5 < base ? base - 1 : base;
}

export function round(v: px): px {
  return Math.round(v);
}

export const generateId = (): string => {
  const chars     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res: string = '';

  for (let i = 0; i < 10; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }

  return res;
};

/**
 * Convert HEX colors to rgba colors
 * Support 3 and 6 base colors
 * @example toRGBA('#ff00ff', 0.1) = 'rgba(255,0,255,0.1)';
 */
export function toRGBA(color: string, opacity: float = 1): color {
  const i = parseInt(color.slice(1), 16);

  if (color.length === 4) {
    return 'rgba(' +
           ((((i >> 8) & 0xf) << 4) + ((i >> 8) & 0xf)) + ',' +
           ((((i >> 4) & 0xf) << 4) + ((i >> 4) & 0xf)) + ',' +
           (((i & 0xf) << 4) + (i & 0xf))
           + ',' + opacity + ')';
  }
  return 'rgba(' + (i >> 16 & 0xff) + ',' + (i >> 8 & 0xff) + ',' + (i & 0xff) + ',' + opacity + ')';
}