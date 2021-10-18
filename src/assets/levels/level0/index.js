export default {
  atlas: {
    width: 4,
    src: '/levels/level0/atlas.png',
  },
  entities: {},
  map: {
    size: {
      width: 20,
      length: 20,
    },
    logic: {
      start: { x: 13, z: 2, look: 'west' },
      goal: { x: 11, z: 18 },
    },
    types: {
      walls: [9, 10, 11, 12],
      floors: [1, 2, 3, 4],
    },
    tiles: [
      0, 0, 10, 10, 10, 10, 9, 10, 10, 10, 10, 10, 9, 10, 10, 10, 0, 0, 0, 0, 0,
      0, 9, 1, 1, 1, 1, 1, 10, 1, 1, 10, 1, 1, 1, 10, 0, 0, 0, 0, 10, 10, 10, 2,
      1, 2, 1, 1, 9, 1, 1, 2, 2, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 2,
      1, 10, 1, 1, 10, 1, 1, 1, 10, 2, 1, 1, 10, 9, 1, 1, 1, 10, 10, 9, 10, 10,
      1, 2, 10, 9, 10, 10, 10, 1, 9, 1, 10, 10, 1, 2, 1, 1, 1, 1, 1, 10, 1, 1,
      1, 1, 2, 1, 10, 1, 1, 2, 10, 10, 1, 1, 1, 10, 1, 2, 1, 10, 1, 1, 10, 1, 1,
      1, 1, 1, 9, 1, 10, 10, 1, 10, 9, 10, 10, 10, 10, 10, 1, 1, 10, 10, 9, 10,
      10, 1, 1, 1, 10, 10, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1, 2,
      1, 10, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 10, 1, 1, 1, 10, 9, 10, 10, 10,
      10, 10, 10, 10, 1, 10, 10, 10, 9, 10, 10, 10, 10, 1, 10, 10, 1, 1, 1, 10,
      0, 10, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 10, 10, 10, 1,
      10, 10, 10, 10, 10, 1, 10, 10, 10, 10, 1, 1, 9, 1, 9, 1, 10, 10, 1, 1, 2,
      1, 1, 10, 1, 1, 2, 1, 1, 9, 1, 1, 1, 1, 1, 1, 10, 10, 1, 9, 1, 9, 1, 10,
      1, 1, 1, 1, 2, 10, 1, 2, 9, 1, 9, 1, 10, 10, 2, 1, 1, 1, 2, 10, 10, 10,
      10, 10, 1, 10, 10, 1, 1, 2, 1, 1, 10, 10, 1, 9, 1, 9, 1, 10, 0, 0, 10, 1,
      1, 1, 10, 1, 1, 1, 1, 1, 10, 10, 1, 1, 2, 2, 1, 10, 0, 0, 9, 1, 1, 1, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 1, 2, 1, 10, 10, 0, 0, 10, 9, 2, 9, 10, 0,
      0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 0, 0, 0, 0, 9, 9, 9, 0, 0, 0, 0, 0,
      0, 0,
    ],
    ceilings: [
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 6,
      5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      6, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 6, 6,
      5, 5, 5, 6, 5, 6, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 6,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 5,
      6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    ],
  },
};
