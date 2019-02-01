import { Game } from './game2/engine/Game';
import { GameCanvas } from './game2/render/GameCanvas';
import { LandsLayer } from './game2/render/LandsLayer';
import { Render } from './game2/render/Render';
import { TilesMng } from './game2/render/TilesMng';
import { LocalImages } from './game2/server/LocalImages';
import { LocalServer } from './game2/server/LocalServer';
import { World } from './game2/world/World';
import { HOST } from '.';


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
Module.setCached('images', () => new LocalImages(HOST));
Module.setCached(LocalServer, () => new LocalServer());
Module.setCached(World, () => new World(get('api')));
Module.setCached(Game, () => new Game(get('api'), get(World)));
Module.setCached(LandsLayer, () => new LandsLayer(get(World), get(TilesMng), get('images')));
Module.setCached(TilesMng, () => new TilesMng(get('api')));
Module.setCached(Render, () => new Render(get(Game), get(LandsLayer)));
Module.setCached(GameCanvas, () => new GameCanvas(get(Render)));

