import { coord } from './types';
import { uint } from '../types';

export function inZone(x: coord, y: coord, zoneX: coord, zoneY: coord, radius: uint) {
  return x >= zoneX - radius && x <= zoneX + radius && y >= zoneY - radius && y <= zoneY + radius;
}