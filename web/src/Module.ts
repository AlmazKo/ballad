import { HOST } from '.';
import { Keyboard } from './game2/controller/Keyboard';
import { Game } from './game2/engine/Game';
import { GameCanvas } from './game2/render/GameCanvas';
import { LandsLayer } from './game2/render/LandsLayer';
import { Render } from './game2/render/Render';
import { ImageAssets } from './game2/server/ImageAssets';
import { LocalImages } from './game2/server/LocalImages';
import { LocalServer } from './game2/server/LocalServer';
import { RemoteImages } from './game2/server/RemoteImages';
import { ResourcesServer } from './game2/server/ResourcesServer';
import { World } from './game2/world/World';


interface Constructor<T = any> {
  new(..._: any[]): T;
}

const data: Map<Constructor | string, any>   = new Map();
const cached: Map<Constructor | string, any> = new Map();


class Module {


  static set<T>(c: Constructor<T> | string, factory: () => T) {
    data.set(c, factory)
  }

  static setCached<T>(c: Constructor<T> | string, factory: () => T) {
    data.set(c, () => {

      const result = cached.get(c);

      if (result === undefined) {
        cached.set(c, factory())
      }

      return cached.get(c)
    })
  }
}

export function get<T>(c: Constructor<T> | string): T {
  const f = data.get(c);
  if (f === undefined) console.warn('DI2', "Not found factory: " + c);

  return f()
}

Module.setCached('api', () => new LocalServer());
Module.setCached('map', () => new ResourcesServer());
Module.setCached('images', () => new ImageAssets(HOST));
Module.setCached(LocalServer, () => new LocalServer());
Module.setCached(Keyboard, () => new Keyboard());
Module.setCached(World, () => new World(get('map')));
Module.setCached(Game, () => new Game(get('api'), get(World)));
Module.setCached(LandsLayer, () => new LandsLayer(get(World), get('images')));
Module.setCached(Render, () => new Render(get(Game), get(LandsLayer)));
Module.setCached(GameCanvas, () => new GameCanvas(get(Render)));

