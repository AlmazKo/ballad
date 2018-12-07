import { TileDrawable } from './TileDrawable';
import { uint } from '../types';

export interface Effect extends TileDrawable {
  id: uint;
  isFinished: boolean;

  stop(): void;
}