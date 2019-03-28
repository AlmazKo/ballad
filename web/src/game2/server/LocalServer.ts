import { Action } from '../../game/actions/Action';
import { ApiMessage } from '../../game/actions/ApiMessage';
import { Package } from '../../game/actions/Package';
import { MapPiece } from '../../game/api/MapPiece';
import { Tiles } from '../../game/api/Tiles';
import { Api } from './Api';
import { MOCK_TILES } from './map';
import { ResourcesApi } from './ResourcesApi';


export class LocalServer implements Api, ResourcesApi {
  private handler: ((msg: Package) => void) | undefined;


  constructor() {

  }

  listen(handler: (msg: Package) => void) {
    this.handler = handler;

    const pkg = {
      tick    : 0,
      time    : 0,
      messages: [
        {
          id    : 1,
          action: "PROTAGONIST_ARRIVAL",
          type  : "",
          data  : {
            "creature": {
              "id"          : 4,
              "isPlayer"    : true,
              "x"           : 18,
              "y"           : 0,
              "direction"   : 2,
              "metrics"     : {"name": "4", "life": 50, "maxLife": 50},
              "viewDistance": 10
            }

          }
        } as ApiMessage]
    } as Package;


    handler(pkg)
  }

  sendAction(action
               :
               Action
  ) {

    console.log("Action >", action);


    // if (action instanceof Step) {
    //   this.ws.send(JSON.stringify({
    //     action: "STEP", id: action.id, data: {
    //       x: action.fromPosX, y: action.fromPosY, direction: action.direction, duration: action.duration
    //     }
    //   }))
    // } else if (action instanceof FireballSpell) {
    //   this.ws.send(JSON.stringify({
    //     action: "SPELL", id: action.id, type: "FIREBALL", data: {
    //
    //       x: action.posX, y: action.posY, direction: action.direction, distance: action.distance, speed: action.duration
    //     }
    //   }))
    //
    // }

  }

  getMapPiece(x: int, y: int): Promise<MapPiece> {

    // ajax('file:///Users/almaz/ballad/resources/map.json')


    const chunk = MOCK_TILES.layers[0].chunks.find(c => c.x === x * 16 && c.y === y * 16);
    if (!chunk) return Promise.error(`Not found piece x=${x}, y=${y}`);
    console.log(`getMapPiece(${x},${y})`, chunk);

    const result = {
      x       : chunk.x,
      y       : chunk.y,
      width   : chunk.width,
      height  : chunk.height,
      terrain : chunk.data,
      objects1: new Array(256).fill(0)
    } as MapPiece;


    return Promise.of(result);
    //
    //


  }

  getTileSet(id: int): Promise<Tiles> {

    const result = {
      columns: 1,
      height : 1,
      data   : [
        {
          "id"  : 23,
          "type": "LAND"
        },
        {
          "id"  : 24,
          "type": "LAND"
        },
        {
          "id"  : 25,
          "type": "LAND"
        },
        {
          "id"  : 26,
          "type": "Wall"
        },
        {
          "id"  : 27,
          "type": "Wall"
        },
        {
          "id"  : 28,
          "type": "Gate"
        },
        {
          "id"  : 29,
          "type": "Gate"
        },
        {
          "id"  : 30,
          "type": "LAND"
        },
        {
          "id"  : 31,
          "type": "LAND"
        },
        {
          "id"  : 32,
          "type": "LAND"
        },
        {
          "id"  : 33,
          "type": "LAND"
        },
        {
          "id"  : 46,
          "type": "LAND"
        },
        {
          "id"  : 47,
          "type": "LAND"
        },
        {
          "id"  : 48,
          "type": "LAND"
        },
        {
          "id"  : 49,
          "type": "Wall"
        },
        {
          "id"  : 50,
          "type": "Wall"
        },
        {
          "id"  : 51,
          "type": "Gate"
        },
        {
          "id"  : 52,
          "type": "Gate"
        },
        {
          "id"  : 53,
          "type": "LAND"
        },
        {
          "id"  : 54,
          "type": "LAND"
        },
        {
          "id"  : 55,
          "type": "LAND"
        },
        {
          "id"  : 56,
          "type": "LAND"
        },
        {
          "id"  : 69,
          "type": "LAND"
        },
        {
          "id"  : 70,
          "type": "LAND"
        },
        {
          "id"  : 71,
          "type": "LAND"
        },
        {
          "id"  : 72,
          "type": "Wall"
        },
        {
          "id"  : 73,
          "type": "Wall"
        },
        {
          "id"  : 74,
          "type": "Wall"
        },
        {
          "id"  : 75,
          "type": "Gate"
        },
        {
          "id"  : 76,
          "type": "LAND"
        },
        {
          "id"  : 77,
          "type": "LAND"
        },
        {
          "id"  : 78,
          "type": "LAND"
        },
        {
          "id"  : 92,
          "type": "LAND"
        },
        {
          "id"  : 93,
          "type": "LAND"
        },
        {
          "id"  : 94,
          "type": "LAND"
        },
        {
          "id"  : 95,
          "type": "Wall"
        },
        {
          "id"  : 96,
          "type": "Wall"
        },
        {
          "id"  : 97,
          "type": "Wall"
        },
        {
          "id"  : 98,
          "type": "Gate"
        },
        {
          "id"  : 115,
          "type": "LAND"
        },
        {
          "id"  : 116,
          "type": "LAND"
        },
        {
          "id"  : 117,
          "type": "LAND"
        },
        {
          "id"  : 118,
          "type": "LAND"
        },
        {
          "id"  : 119,
          "type": "LAND"
        },
        {
          "id"  : 120,
          "type": "LAND"
        },
        {
          "id"  : 121,
          "type": "LAND"
        },
        {
          "id"  : 122,
          "type": "LAND"
        },
        {
          "id"  : 123,
          "type": "LAND"
        },
        {
          "id"  : 124,
          "type": "LAND"
        },
        {
          "id"  : 125,
          "type": "LAND"
        },
        {
          "id"  : 139,
          "type": "LAND"
        },
        {
          "id"  : 141,
          "type": "LAND"
        },
        {
          "id"  : 142,
          "type": "LAND"
        },
        {
          "id"  : 143,
          "type": "LAND"
        },
        {
          "id"  : 144,
          "type": "LAND"
        },
        {
          "id"  : 145,
          "type": "LAND"
        },
        {
          "id"  : 146,
          "type": "LAND"
        },
        {
          "id"  : 147,
          "type": "LAND"
        },
        {
          "id"  : 148,
          "type": "LAND"
        },
        {
          "id"  : 164,
          "type": "LAND"
        },
        {
          "id"  : 165,
          "type": "LAND"
        },
        {
          "id"  : 166,
          "type": "LAND"
        },
        {
          "id"  : 167,
          "type": "LAND"
        },
        {
          "id"  : 168,
          "type": "LAND"
        },
        {
          "id"  : 169,
          "type": "LAND"
        },
        {
          "id"  : 170,
          "type": "LAND"
        },
        {
          "id"  : 171,
          "type": "LAND"
        },
        {
          "id"  : 187,
          "type": "LAND"
        },
        {
          "id"  : 188,
          "type": "LAND"
        },
        {
          "id"  : 189,
          "type": "LAND"
        },
        {
          "id"  : 190,
          "type": "LAND"
        },
        {
          "id"  : 191,
          "type": "LAND"
        },
        {
          "id"  : 192,
          "type": "LAND"
        },
        {
          "id"  : 193,
          "type": "LAND"
        },
        {
          "id"  : 194,
          "type": "LAND"
        },
        {
          "id"  : 199,
          "type": "Wall"
        },
        {
          "id"  : 200,
          "type": "Wall"
        },
        {
          "id"  : 201,
          "type": "Gate"
        },
        {
          "id"  : 202,
          "type": "Gate"
        },
        {
          "id"  : 210,
          "type": "LAND"
        },
        {
          "id"  : 211,
          "type": "LAND"
        },
        {
          "id"  : 212,
          "type": "LAND"
        },
        {
          "id"  : 213,
          "type": "LAND"
        },
        {
          "id"  : 214,
          "type": "LAND"
        },
        {
          "id"  : 215,
          "type": "LAND"
        },
        {
          "id"  : 216,
          "type": "LAND"
        },
        {
          "id"  : 217,
          "type": "LAND"
        },
        {
          "id"  : 222,
          "type": "Wall"
        },
        {
          "id"  : 223,
          "type": "Wall"
        },
        {
          "id"  : 224,
          "type": "Gate"
        },
        {
          "id"  : 225,
          "type": "Gate"
        },
        {
          "id"  : 226,
          "type": "Wall"
        },
        {
          "id"  : 227,
          "type": "Wall"
        },
        {
          "id"  : 228,
          "type": "Wall"
        },
        {
          "id"  : 229,
          "type": "Wall"
        },
        {
          "id"  : 234,
          "type": "LAND"
        },
        {
          "id"  : 236,
          "type": "LAND"
        },
        {
          "id"  : 237,
          "type": "LAND"
        },
        {
          "id"  : 238,
          "type": "LAND"
        },
        {
          "id"  : 239,
          "type": "LAND"
        },
        {
          "id"  : 240,
          "type": "LAND"
        },
        {
          "id"  : 245,
          "type": "Wall"
        },
        {
          "id"  : 246,
          "type": "Wall"
        },
        {
          "id"  : 247,
          "type": "Wall"
        },
        {
          "id"  : 248,
          "type": "Wall"
        },
        {
          "id"  : 249,
          "type": "Wall"
        },
        {
          "id"  : 250,
          "type": "Wall"
        },
        {
          "id"  : 251,
          "type": "Wall"
        },
        {
          "id"  : 252,
          "type": "Wall"
        },
        {
          "id"  : 258,
          "type": "LAND"
        },
        {
          "id"  : 259,
          "type": "LAND"
        },
        {
          "id"  : 260,
          "type": "LAND"
        },
        {
          "id"  : 261,
          "type": "LAND"
        },
        {
          "id"  : 262,
          "type": "LAND"
        },
        {
          "id"  : 263,
          "type": "LAND"
        },
        {
          "id"  : 268,
          "type": "Wall"
        },
        {
          "id"  : 269,
          "type": "Wall"
        },
        {
          "id"  : 270,
          "type": "Wall"
        },
        {
          "id"  : 271,
          "type": "Wall"
        },
        {
          "id"  : 281,
          "type": "LAND"
        },
        {
          "id"  : 282,
          "type": "LAND"
        },
        {
          "id"  : 283,
          "type": "LAND"
        },
        {
          "id"  : 284,
          "type": "LAND"
        },
        {
          "id"  : 285,
          "type": "LAND"
        },
        {
          "id"  : 286,
          "type": "LAND"
        },
        {
          "id"  : 304,
          "type": "LAND"
        },
        {
          "id"  : 305,
          "type": "LAND"
        },
        {
          "id"  : 306,
          "type": "LAND"
        },
        {
          "id"  : 307,
          "type": "LAND"
        },
        {
          "id"  : 308,
          "type": "LAND"
        },
        {
          "id"  : 309,
          "type": "LAND"
        },
        {
          "id"  : 327,
          "type": "LAND"
        },
        {
          "id"  : 328,
          "type": "LAND"
        },
        {
          "id"  : 329,
          "type": "LAND"
        },
        {
          "id"  : 330,
          "type": "LAND"
        },
        {
          "id"  : 331,
          "type": "LAND"
        },
        {
          "id"  : 332,
          "type": "LAND"
        },
        {
          "id"  : 368,
          "type": "Water"
        },
        {
          "id"  : 369,
          "type": "Water"
        },
        {
          "id"  : 370,
          "type": "Water"
        },
        {
          "id"  : 371,
          "type": "Water"
        },
        {
          "id"  : 374,
          "type": "Water"
        },
        {
          "id"  : 375,
          "type": "Water"
        },
        {
          "id"  : 376,
          "type": "Water"
        },
        {
          "id"  : 391,
          "type": "Water"
        },
        {
          "id"  : 392,
          "type": "Water"
        },
        {
          "id"  : 393,
          "type": "LAND"
        },
        {
          "id"  : 394,
          "type": "LAND"
        },
        {
          "id"  : 395,
          "type": "LAND"
        },
        {
          "id"  : 396,
          "type": "LAND"
        },
        {
          "id"  : 397,
          "type": "Water"
        },
        {
          "id"  : 398,
          "type": "Water"
        },
        {
          "id"  : 399,
          "type": "Water"
        },
        {
          "id"  : 414,
          "type": "Water"
        },
        {
          "id"  : 415,
          "type": "Water"
        },
        {
          "id"  : 416,
          "type": "LAND"
        },
        {
          "id"  : 417,
          "type": "LAND"
        },
        {
          "id"  : 418,
          "type": "LAND"
        },
        {
          "id"  : 419,
          "type": "LAND"
        },
        {
          "id"  : 420,
          "type": "Water"
        },
        {
          "id"  : 421,
          "type": "Water"
        },
        {
          "id"  : 422,
          "type": "Water"
        },
        {
          "id"  : 437,
          "type": "Water"
        },
        {
          "id"  : 438,
          "type": "Water"
        },
        {
          "id"  : 439,
          "type": "Water"
        },
        {
          "id"  : 440,
          "type": "Water"
        },
        {
          "id"  : 441,
          "type": "Water"
        },
        {
          "id"  : 442,
          "type": "Water"
        },
        {
          "id"  : 443,
          "type": "LAND"
        },
        {
          "id"  : 444,
          "type": "LAND"
        },
        {
          "id"  : 445,
          "type": "LAND"
        },
        {
          "id"  : 460,
          "type": "Water"
        },
        {
          "id"  : 461,
          "type": "Water"
        },
        {
          "id"  : 462,
          "type": "Water"
        },
        {
          "id"  : 463,
          "type": "Water"
        },
        {
          "id"  : 464,
          "type": "Water"
        },
        {
          "id"  : 465,
          "type": "Water"
        },
        {
          "id"  : 466,
          "type": "LAND"
        },
        {
          "id"  : 467,
          "type": "LAND"
        },
        {
          "id"  : 468,
          "type": "LAND"
        },
        {
          "id"  : 485,
          "type": "Water"
        },
        {
          "id"  : 486,
          "type": "Water"
        },
        {
          "id"  : 487,
          "type": "Water"
        },
        {
          "id"  : 488,
          "type": "Water"
        },
        {
          "id"  : 489,
          "type": "LAND"
        },
        {
          "id"  : 490,
          "type": "LAND"
        },
        {
          "id"  : 491,
          "type": "LAND"
        },
        {
          "id"  : 506,
          "type": "LAND"
        },
        {
          "id"  : 507,
          "type": "LAND"
        },
        {
          "id"  : 508,
          "type": "LAND"
        },
        {
          "id"  : 509,
          "type": "LAND"
        },
        {
          "id"  : 510,
          "type": "LAND"
        },
        {
          "id"  : 511,
          "type": "LAND"
        },
        {
          "id"  : 512,
          "type": "LAND"
        },
        {
          "id"  : 513,
          "type": "LAND"
        },
        {
          "id"  : 514,
          "type": "LAND"
        },
        {
          "id"  : 529,
          "type": "LAND"
        },
        {
          "id"  : 530,
          "type": "LAND"
        },
        {
          "id"  : 531,
          "type": "LAND"
        },
        {
          "id"  : 532,
          "type": "LAND"
        },
        {
          "id"  : 533,
          "type": "LAND"
        },
        {
          "id"  : 534,
          "type": "LAND"
        },
        {
          "id"  : 535,
          "type": "LAND"
        },
        {
          "id"  : 536,
          "type": "LAND"
        },
        {
          "id"  : 537,
          "type": "LAND"
        },
        {
          "id"  : 552,
          "type": "LAND"
        },
        {
          "id"  : 553,
          "type": "LAND"
        },
        {
          "id"  : 554,
          "type": "LAND"
        },
        {
          "id"  : 555,
          "type": "LAND"
        },
        {
          "id"  : 556,
          "type": "LAND"
        },
        {
          "id"  : 557,
          "type": "LAND"
        },
        {
          "id"  : 558,
          "type": "LAND"
        },
        {
          "id"  : 559,
          "type": "LAND"
        },
        {
          "id"  : 560,
          "type": "LAND"
        },
        {
          "id"  : 575,
          "type": "LAND"
        },
        {
          "id"  : 576,
          "type": "LAND"
        },
        {
          "id"  : 577,
          "type": "LAND"
        },
        {
          "id"  : 578,
          "type": "LAND"
        },
        {
          "id"  : 579,
          "type": "LAND"
        },
        {
          "id"  : 580,
          "type": "LAND"
        },
        {
          "id"  : 581,
          "type": "LAND"
        },
        {
          "id"  : 582,
          "type": "LAND"
        },
        {
          "id"  : 598,
          "type": "LAND"
        },
        {
          "id"  : 599,
          "type": "LAND"
        },
        {
          "id"  : 600,
          "type": "LAND"
        },
        {
          "id"  : 601,
          "type": "LAND"
        },
        {
          "id"  : 602,
          "type": "LAND"
        },
        {
          "id"  : 603,
          "type": "LAND"
        },
        {
          "id"  : 604,
          "type": "LAND"
        },
        {
          "id"  : 605,
          "type": "LAND"
        },
        {
          "id"  : 621,
          "type": "LAND"
        },
        {
          "id"  : 622,
          "type": "LAND"
        },
        {
          "id"  : 623,
          "type": "LAND"
        },
        {
          "id"  : 624,
          "type": "LAND"
        },
        {
          "id"  : 625,
          "type": "LAND"
        },
        {
          "id"  : 626,
          "type": "LAND"
        },
        {
          "id"  : 644,
          "type": "LAND"
        },
        {
          "id"  : 645,
          "type": "LAND"
        },
        {
          "id"  : 646,
          "type": "LAND"
        },
        {
          "id"  : 647,
          "type": "LAND"
        },
        {
          "id"  : 648,
          "type": "LAND"
        },
        {
          "id"  : 649,
          "type": "LAND"
        }]
    } as Tiles;


    return Promise.of(result);
  }


}
