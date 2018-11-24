import { Action } from './actions/Action';

export class Server {

  sendAction(action: Action) {

    console.log("New action", action)
  }

  subOnAction(handler: (action: any) => void) {

  }
}