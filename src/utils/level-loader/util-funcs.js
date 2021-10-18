/**
 * @typedef {import('./types.js').LevelData} LevelData
 * @typedef {import('./types.js').UtilFuncs} UtilFuncs
 * @typedef {import('./types.js').Direction} Direction
 */

import memoize from 'lodash-es/memoize';

import { Direction } from './common.js';

/**
 * @param {LevelData} levelData
 * @return {UtilFuncs}
 */
export default function createUtilFuncs({ atlas, map }) {
  const { tiles: mapTiles, ceilings: ceilingTiles } = map;
  const { width: mapWidth } = map.size;
  const { floors: floorTileIndices, walls: wallTileIndices } = map.types;

  const { width: atlasWidth } = atlas;

  const atlasIndexToCoords = memoize(
    /**
     * @param {number} index Index referring to the atlas tile. Index starts at
     * 1 (0 is null).
     */
    index => {
      const i = index - 1;
      const x = i % atlasWidth;
      const y = Math.floor(i / atlasWidth);
      return {
        u: x / atlasWidth,
        v: 1 - y / atlasWidth,
      };
    }
  );

  const atlasTileUnitSize = 1 / atlasWidth;

  const indexToCoords = memoize(
    /**
     * @param {number} index
     */
    index => {
      const x = index % mapWidth;
      const z = Math.floor(index / mapWidth);
      return { x, z };
    }
  );

  const coordsToIndex = memoize(
    /**
     * @param {number} x
     * @param {number} z
     */
    (x, z) => z * mapWidth + x,
    (x, z) => `${x}_${z}`
  );

  const isFloor = memoize(
    /**
     * @param {number} mapValue
     */
    mapValue => floorTileIndices.some(i => i === mapValue)
  );

  const isWall = memoize(
    /**
     * @param {number} mapValue
     */
    mapValue => wallTileIndices.some(i => i === mapValue)
  );

  /**
   * @param {number} x
   * @param {number} z
   */
  const getValue = (x, z) => mapTiles[coordsToIndex(x, z)];

  /**
   * @param {number} index
   */
  const getValueByIndex = index => mapTiles[index];

  /**
   * @param {number} x
   * @param {number} z
   */
  const getCeilingValue = (x, z) => ceilingTiles[coordsToIndex(x, z)];

  /**
   * @param {number} index
   */
  const getCeilingValueByIndex = index => ceilingTiles[index];

  const dirOffset = {
    [Direction.north]: { x: 0, z: -1 },
    [Direction.south]: { x: 0, z: 1 },
    [Direction.west]: { x: -1, z: 0 },
    [Direction.east]: { x: 1, z: 0 },
  };

  /**
   * @param {number} x
   * @param {number} z
   * @param {Direction} dir
   */
  const getAdjacentValue = (x, z, dir) => {
    const o = dirOffset[dir];
    return getValue(x + o.x, z + o.z);
  };

  const dirOffsetByIndex = {
    [Direction.north]: index => index - mapWidth,
    [Direction.south]: index => index + mapWidth,
    [Direction.west]: index => {
      const temp = index - 1;
      // Check if still same row
      return Math.floor(temp / mapWidth) === Math.floor(index / mapWidth)
        ? temp
        : -1;
    },
    [Direction.east]: index => {
      const temp = index + 1;
      // Check if still same row
      return Math.floor(temp / mapWidth) === Math.floor(index / mapWidth)
        ? temp
        : -1;
    },
  };

  /**
   * @param {number} index
   * @param {Direction} dir
   */
  const getAdjacentValueByIndex = (index, dir) => {
    const f = dirOffsetByIndex[dir];
    return getValueByIndex(f(index));
  };

  return {
    atlasUtils: {
      indexToCoords: atlasIndexToCoords,
      tileUnitSize: atlasTileUnitSize,
    },
    mapUtils: {
      indexToCoords,
      coordsToIndex,
      isFloor,
      isWall,
      getValue,
      getValueByIndex,
      getCeilingValue,
      getCeilingValueByIndex,
      getAdjacentValue,
      getAdjacentValueByIndex,
    },
  };
}
