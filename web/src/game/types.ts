import { int, px } from '../types';

export const CELL: px  = 32;
export const HCELL: px = CELL / 2;
export const QCELL: px = CELL / 4;

export enum Dir {
  NORTH = 1,
  SOUTH = 2,
  WEST  = 3,
  EAST  = 4
}

export const BTN_1  = 49;
export const BTN_2 = 50;
export const BTN_3 = 51;


export type coord = int;
