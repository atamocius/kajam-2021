/**
 * @typedef {import('./types.js').LevelData} LevelData
 * @typedef {import('./types.js').AtlasUtilFuncs} AtlasUtilFuncs
 * @typedef {import('./types.js').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./types.js').TessellationFuncs} TessellationFuncs
 */

import { Direction } from './common.js';
import createUtilFuncs from './util-funcs.js';
import createGenerateQuadUVsFunc from './uv-funcs.js';

/**
 * @param {LevelData} levelData
 */
export default function tessellateMap(levelData) {
  const { map } = levelData;
  const { atlasUtils, mapUtils } = createUtilFuncs(levelData);

  const vertexBuffer = [];
  const normalBuffer = [];
  const uvBuffer = [];
  const indexBuffer = [];

  const tf = createTessellationFuncs(
    mapUtils,
    atlasUtils,
    vertexBuffer,
    normalBuffer,
    uvBuffer,
    indexBuffer
  );

  const tessellateTile = createTessellateTileFunc(tf);

  for (let i = 0; i < map.tiles.length; i++) {
    tessellateTile(i);
  }

  const vertices = new Float32Array(vertexBuffer);
  const normals = new Float32Array(normalBuffer);
  const uvs = new Float32Array(uvBuffer);
  const indices = new Uint32Array(indexBuffer);

  return {
    size: map.size,
    logic: map.logic,
    geometry: {
      vertices,
      normals,
      uvs,
      indices,
    },
    utils: { ...mapUtils },
  };
}

/**
 * @param {TessellationFuncs} tessellationFuncs
 */
function createTessellateTileFunc(tessellationFuncs) {
  const {
    tessellateFloor,
    tessellateCeiling,
    tessellateNorthWall,
    tessellateSouthWall,
    tessellateWestWall,
    tessellateEastWall,
  } = tessellationFuncs;

  /**
   * @param {number} mapIndex
   */
  const tessellateTile = mapIndex => {
    // Check if floor
    if (tessellateFloor(mapIndex)) {
      // If floor, also tessellate the ceiling
      tessellateCeiling(mapIndex);
      return;
    }

    tessellateNorthWall(mapIndex);
    tessellateSouthWall(mapIndex);
    tessellateWestWall(mapIndex);
    tessellateEastWall(mapIndex);
  };

  return tessellateTile;
}

/**
 * @param {MapUtilFuncs} mapUtils
 * @param {AtlasUtilFuncs} atlasUtils
 * @param {number[]} vertexBuffer
 * @param {number[]} normalBuffer
 * @param {number[]} uvBuffer
 * @param {number[]} indexBuffer
 * @return {TessellationFuncs}
 */
function createTessellationFuncs(
  mapUtils,
  atlasUtils,
  vertexBuffer,
  normalBuffer,
  uvBuffer,
  indexBuffer
) {
  const {
    indexToCoords: mapIndexToCoords,
    getValueByIndex: getMapValueByIndex,
    isFloor,
    getCeilingValueByIndex,
    getAdjacentValueByIndex,
  } = mapUtils;
  const { indexToCoords: atlasIndexToCoords, tileUnitSize: atlasTileUnitSize } =
    atlasUtils;

  const generateQuadUVs = createGenerateQuadUVsFunc(
    atlasIndexToCoords,
    atlasTileUnitSize
  );

  /**
   * @param {number} mapIndex
   */
  const generateCorners = mapIndex => {
    const { x, z } = mapIndexToCoords(mapIndex);
    return {
      left: x,
      right: x + 1,
      top: z,
      bottom: z + 1,
    };
  };

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  const generateQuadNormals = (x, y, z) => {
    // prettier-ignore
    normalBuffer.push(
      x, y, z,
      x, y, z,
      x, y, z,
      x, y, z,
    );
  };

  const generateQuadIndices = () => {
    const offset = vertexBuffer.length / 3;
    // prettier-ignore
    indexBuffer.push(
      offset + 0,  offset + 1,  offset + 2,
      offset + 2,  offset + 1,  offset + 3,
    );
  };

  /**
   * @param {number} mapIndex
   */
  const tessellateFloor = mapIndex => {
    const value = getMapValueByIndex(mapIndex);

    // Tessellate only if not a null tile AND a floor
    if (value < 1 || !isFloor(value)) {
      return false;
    }

    const { left, right, top, bottom } = generateCorners(mapIndex);
    generateQuadUVs(value, uvBuffer);
    generateQuadNormals(0, 1, 0);
    generateQuadIndices();

    // prettier-ignore
    vertexBuffer.push(
      left ,  0.0,  bottom,
      right,  0.0,  bottom,
      left ,  0.0,  top,
      right,  0.0,  top,
    );

    return true;
  };

  /**
   * @param {number} mapIndex
   */
  const tessellateCeiling = mapIndex => {
    const value = getCeilingValueByIndex(mapIndex);

    // If null tile, skip tessellation
    if (value < 1) {
      return;
    }

    const { left, right, top, bottom } = generateCorners(mapIndex);
    generateQuadUVs(value, uvBuffer);
    generateQuadNormals(0, -1, 0);
    generateQuadIndices();

    // prettier-ignore
    vertexBuffer.push(
      right,  1.0,  bottom,
      left ,  1.0,  bottom,
      right,  1.0,  top,
      left ,  1.0,  top,
    );
  };

  /**
   * @param {number} mapIndex
   */
  const tessellateNorthWall = mapIndex => {
    const value = getMapValueByIndex(mapIndex);
    const adjValue = getAdjacentValueByIndex(mapIndex, Direction.north);

    // Tessellate only if not a null tile AND adjacent to a floor
    if (value < 1 || !isFloor(adjValue)) {
      return;
    }

    const { left, right, top } = generateCorners(mapIndex);
    generateQuadUVs(value, uvBuffer);
    generateQuadNormals(0, 0, -1);
    generateQuadIndices();

    // prettier-ignore
    vertexBuffer.push(
      right,  0.0,  top,
      left ,  0.0,  top,
      right,  1.0,  top,
      left ,  1.0,  top,
    );
  };

  /**
   * @param {number} mapIndex
   */
  const tessellateSouthWall = mapIndex => {
    const value = getMapValueByIndex(mapIndex);
    const adjValue = getAdjacentValueByIndex(mapIndex, Direction.south);

    // Tessellate only if not a null tile AND adjacent to a floor
    if (value < 1 || !isFloor(adjValue)) {
      return;
    }

    const { left, right, bottom } = generateCorners(mapIndex);
    generateQuadUVs(value, uvBuffer);
    generateQuadNormals(0, 0, 1);
    generateQuadIndices();

    // prettier-ignore
    vertexBuffer.push(
      left ,  0.0,  bottom,
      right,  0.0,  bottom,
      left ,  1.0,  bottom,
      right,  1.0,  bottom,
    );
  };

  /**
   * @param {number} mapIndex
   */
  const tessellateWestWall = mapIndex => {
    const value = getMapValueByIndex(mapIndex);
    const adjValue = getAdjacentValueByIndex(mapIndex, Direction.west);

    // Tessellate only if not a null tile AND adjacent to a floor
    if (value < 1 || !isFloor(adjValue)) {
      return;
    }

    const { left, top, bottom } = generateCorners(mapIndex);
    generateQuadUVs(value, uvBuffer);
    generateQuadNormals(-1, 0, 0);
    generateQuadIndices();

    // prettier-ignore
    vertexBuffer.push(
      left,  0.0,  top,
      left,  0.0,  bottom,
      left,  1.0,  top,
      left,  1.0,  bottom,
    );
  };

  /**
   * @param {number} mapIndex
   */
  const tessellateEastWall = mapIndex => {
    const value = getMapValueByIndex(mapIndex);
    const adjValue = getAdjacentValueByIndex(mapIndex, Direction.east);

    // Tessellate only if not a null tile AND adjacent to a floor
    if (value < 1 || !isFloor(adjValue)) {
      return;
    }

    const { right, top, bottom } = generateCorners(mapIndex);
    generateQuadUVs(value, uvBuffer);
    generateQuadNormals(1, 0, 0);
    generateQuadIndices();

    // prettier-ignore
    vertexBuffer.push(
      right,  0.0,  bottom,
      right,  0.0,  top,
      right,  1.0,  bottom,
      right,  1.0,  top,
    );
  };

  return {
    tessellateFloor,
    tessellateCeiling,
    tessellateNorthWall,
    tessellateSouthWall,
    tessellateWestWall,
    tessellateEastWall,
  };
}
