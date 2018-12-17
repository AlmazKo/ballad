export interface Tiles {
  readonly columns: uint,
  readonly height: uint,
  readonly data: Array<{ id: int, type: string }>
}