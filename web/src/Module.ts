import { HOST } from '.';
import { Keyboard } from './game2/controller/Keyboard';
import { Game } from './game2/engine/Game';
import { Moving } from './game2/engine/Moving';
import { GameCanvas } from './game2/render/GameCanvas';
import { LandsLayer } from './game2/render/LandsLayer';
import { Render } from './game2/render/Render';
import { ImageAssets } from './game2/server/ImageAssets';
import { LocalServer } from './game2/server/LocalServer';
import { ResourcesServer } from './game2/server/ResourcesServer';
import { World } from './game2/world/World';


interface Constructor<T = any> {
  new(..._: any[]): T;
}

const data: Map<Constructor | string, any>   = new Map();
const cached: Map<Constructor | string, any> = new Map();


function set<T>(c: Constructor<T> | string, factory: () => T) {
  data.set(c, factory)
}

function setCached<T>(c: Constructor<T> | string, factory: () => T) {
  data.set(c, () => {

    const result = cached.get(c);

    if (result === undefined) {
      cached.set(c, factory())
    }

    return cached.get(c)
  })
}

export function get<T>(c: Constructor<T> | string): T {
  const f = data.get(c);
  if (f === undefined) console.warn('DI2', "Not found factory: " + c);

  return f()
}

setCached('api', () => new LocalServer());
setCached('map', () => new ResourcesServer());
setCached('images', () => new ImageAssets(HOST));
// setCached(LocalServer, () => new LocalServer());
setCached(Moving, () => new Moving());
setCached(Keyboard, () => new Keyboard(get(Moving), get(Game)));
setCached(World, () => new World(get('map')));
setCached(Game, () => new Game(get('api'), get(World), get(Moving)));
setCached(LandsLayer, () => new LandsLayer(get(World), get('images')));
setCached(Render, () => new Render(get(Game), get(LandsLayer), get('images')));
setCached(GameCanvas, () => new GameCanvas(get(Render)));

