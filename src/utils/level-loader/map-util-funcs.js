/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./types.js').Direction} Direction
 */

import memoize from 'lodash-es/memoize';

import { Direction } from './common.js';

/**
 * @param {MapData} map
 * @return {MapUtilFuncs}
 */
export default function createMapUtilFuncs(map) {
  const { tiles: mapTiles, ceilings: ceilingTiles } = map;
  const { width: mapWidth } = map.size;
  const { floors: floorTileIndices, walls: wallTileIndices } = map.types;
  const { props, pickups } = map.logic.entities;

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

  const getStageProp = memoize(
    /**
     * @param {number} x
     * @param {number} z
     */
    (x, z) => props.find(p => p.position.x === x && p.position.z === z),
    (x, z) => `${x}_${z}`
  );

  const getPickup = memoize(
    /**
     * @param {number} x
     * @param {number} z
     */
    (x, z) => pickups.find(p => p.position.x === x && p.position.z === z),
    (x, z) => `${x}_${z}`
  );

  const isWalkable = memoize(
    /**
     * @param {number} x
     * @param {number} z
     */
    (x, z) => {
      const mapValue = getValue(x, z);
      const stageProp = getStageProp(x, z);
      return isFloor(mapValue) && !(stageProp && stageProp.isMoveBlocker);
    },
    (x, z) => `${x}_${z}`
  );

  const isVisionBlocker = memoize(
    /**
     * @param {number} x
     * @param {number} z
     */
    (x, z) => {
      const mapValue = getValue(x, z);
      const stageProp = getStageProp(x, z);
      return isWall(mapValue) || (stageProp && stageProp.isVisionBlocker);
    },
    (x, z) => `${x}_${z}`
  );

  return {
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

    // Stage Props
    getStageProp,

    // Pickups
    getPickup,

    // Validation
    isWalkable,
    isVisionBlocker,
  };
}
