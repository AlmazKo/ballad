export interface MapPiece {
  readonly x: int,
  readonly y: int,
  readonly width: uint,
  readonly height: uint,
  readonly terrain: int[]
  readonly objects1: int[]
}
