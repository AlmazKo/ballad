import { coord } from '../game2/render/constants';

export function inZone(x: coord, y: coord, zoneX: coord, zoneY: coord, radius: uint) {
  return x >= zoneX - radius && x <= zoneX + radius && y >= zoneY - radius && y <= zoneY + radius;
}
