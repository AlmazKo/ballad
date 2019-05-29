export enum Dir {
  // NOPE = 0,
  NORTH = 1,
  SOUTH = 2,
  WEST  = 3,
  EAST  = 4
}


export enum TileType {
  NOTHING    = 0,
  GRASS      = 1,
  SAND       = 2,
  LAVA       = 3,
  SHALLOW    = 4,
  DEEP_WATER = 5,
  ICE        = 6,
  SNOW       = 7,
  ROAD       = 8
}


export function debugTile(t: TileType): string {
  switch (t) {
    case TileType.NOTHING:
      return '∙';
    case TileType.GRASS:
      return '⋎';
    case TileType.SAND:
      return '∷';
    case TileType.LAVA:
      return '⋍';
    case TileType.SHALLOW:
      return '~';
    case TileType.DEEP_WATER:
      return '≈';
    case TileType.ICE:
      return '–';
    case TileType.SNOW:
      return '∴';
    case TileType.ROAD:
      return '='

  }
}
