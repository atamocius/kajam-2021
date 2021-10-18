/**
 * @typedef {import('three').Texture} Texture
 */

export {};

/**
 * @typedef {Object} LoadedLevelData
 * @property {MapSize} size
 * @property {MapLogic} logic
 * @property {GeometryData} geometry
 * @property {MapUtilFuncs} utils
 */

/**
 * @typedef {Object} GeometryData
 * @property {Texture} atlas
 * @property {Float32Array} vertices
 * @property {Float32Array} normals
 * @property {Float32Array} uvs
 * @property {Uint32Array} indices
 */

/**
 * @typedef {Object} LevelData
 * @property {AtlasData} atlas
 * @property {MapData} map
 */

/**
 * @typedef {Object} AtlasData
 * @property {number} width
 * @property {string} src
 */

/**
 * @typedef {Object} MapData
 * @property {MapSize} size
 * @property {MapLogic} logic
 * @property {MapTypes} types
 * @property {number[]} tiles
 * @property {number[]} ceilings
 */

/**
 * @typedef {Object} MapSize
 * @property {number} width
 * @property {number} length
 */

/**
 * @typedef {Object} MapLogic
 * @property {MapCoords & { look: Direction }} start
 * @property {MapCoords} goal
 */

/**
 * @typedef {Object} MapTypes
 * @property {number[]} walls
 * @property {number[]} floors
 */

/**
 * @typedef {Object} MapCoords
 * @property {number} x
 * @property {number} z
 */

/**
 * @typedef {Object} AtlasCoords
 * @property {number} u
 * @property {number} v
 */

/**
 * @typedef {'north' | 'south' | 'west' | 'east'} Direction
 */

/**
 * @typedef {Object} UtilFuncs
 * @property {AtlasUtilFuncs} atlasUtils
 * @property {MapUtilFuncs} mapUtils
 */

/**
 * @typedef {Object} AtlasUtilFuncs
 * @property {(index: number) => AtlasCoords} indexToCoords
 * @property {number} tileUnitSize
 */

/**
 * @typedef {Object} MapUtilFuncs
 * @property {(index: number) => MapCoords} indexToCoords
 * @property {(x: number, z: number) => number} coordsToIndex
 * @property {(mapValue: number) => boolean} isFloor
 * @property {(mapValue: number) => boolean} isWall
 * @property {(x: number, z: number) => number} getValue
 * @property {(index: number) => number} getValueByIndex
 * @property {(x: number, z: number) => number} getCeilingValue
 * @property {(index: number) => number} getCeilingValueByIndex
 * @property {(x: number, z: number, dir: Direction) => number} getAdjacentValue
 * @property {(index: number, dir: Direction) => number} getAdjacentValueByIndex
 */

/**
 * @typedef {Object} TessellationFuncs
 * @property {(mapIndex: number) => boolean} tessellateFloor
 * @property {(mapIndex: number) => void} tessellateCeiling
 * @property {(mapIndex: number) => void} tessellateNorthWall
 * @property {(mapIndex: number) => void} tessellateSouthWall
 * @property {(mapIndex: number) => void} tessellateWestWall
 * @property {(mapIndex: number) => void} tessellateEastWall
 */
