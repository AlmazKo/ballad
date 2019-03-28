import { Action } from '../../game/actions/Action';
import { Package } from '../../game/actions/Package';

export interface Api {

  listen(handler: (pkg: Package) => void): void;

  sendAction(action: Action): void;
}
