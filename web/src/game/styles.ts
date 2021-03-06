import { toRGBA } from '../canvas/utils';
import { FontStyle } from '../draw/FontStyleAcceptor';
import { StrokeStyle } from '../draw/StrokeStyleAcceptor';

export const style = {
  grid  : {
    style: toRGBA("#333", 0.5),
    width: 1,
    dash : [3, 5]
  },
  bullet: {
    style: "#333",
    width: 2
  },

  fireShock : "#ff4200",
  fog       : toRGBA("#000", 0.666),
  playerZone: toRGBA("#007704", 0.2),

  player         : {
    style: "#f00",
    width: 3
  },
  goodLifeLine   : {
    style: "#00ff0b",
    width: 2
  } as Partial<StrokeStyle>,
  warningLifeLine: {
    style: "#fff900",
    width: 2
  } as Partial<StrokeStyle>,
  dangerLifeLine : {
    style: "#ff0000",
    width: 2
  } as Partial<StrokeStyle>,
  playerDescr    : {
    align   : "left",
    baseline: "top",
    style   : "blue",
    font    : "15px"
  } as Partial<FontStyle>,

  creatureName: {
    align   : "center",
    baseline: "top",
    style   : "white",
    font    : "bold 8px Regular"
  } as Partial<FontStyle>,

  creatureNameBg: {
    align   : "center",
    baseline: "top",
    style   : "black",
    font    : "bold 8px Regular"
  } as Partial<FontStyle>,

  lifeText: {
    align   : "center",
    baseline: "bottom",
    style   : "blue",
    font    : "7px sans"
  } as Partial<FontStyle>,

  dmgText: {
    align   : "center",
    baseline: "top",
    style   : "#fff",
    font    : "bold 23px sans"
  } as Partial<FontStyle>,

  dmgText2: {
    align   : "center",
    baseline: "top",
    style   : "#000",
    font    : "bold 24px sans"
  } as Partial<FontStyle>,

  debugText: {
    align: "left",
    style: "#000",
    font : "12px sans-serif"
  } as Partial<FontStyle>
};
