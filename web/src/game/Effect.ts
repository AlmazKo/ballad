import { TileDrawable } from './TileDrawable';

export interface Effect extends TileDrawable {
  id: uint;
  isFinished: boolean;

  stop(): void;
}