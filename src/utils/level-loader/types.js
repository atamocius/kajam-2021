/**
 * @typedef {import('three').Texture} Texture
 * @typedef {import('three').BufferGeometry} BufferGeometry
 */

export {};

/**
 * @typedef {Object} LoadedLevelData
 * @property {Texture} atlas
 * @property {MapSize} size
 * @property {MapLogic} logic
 * @property {BufferGeometry} geometry
 * @property {MapUtilFuncs} utils
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
 * @property {PlayerStartData} start
 * @property {MapCoords} goal
 * @property {Entities} entities
 */

/**
 * @typedef {MapCoords & { look: Direction }} PlayerStartData
 */

/**
 * @typedef {Object} Entities
 * @property {StagePropEntity[]} props
 * @property {EnemyEntity[]} enemies
 * @property {PickupEntity[]} pickups
 */

/**
 * @typedef {Object} StagePropEntity
 * @property {string} kind
 * @property {MapCoords} position
 * @property {{ x: number, y: number, z: number }} rotation
 * @property {boolean} isMoveBlocker
 * @property {boolean} isVisionBlocker
 */

/**
 * @typedef {Object} EnemyEntity
 * @property {string} kind
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {number} sightRange
 * @property {number} healthClass
 * @property {number} speedClass
 */

/**
 * @typedef {Object} PickupEntity
 * @property {string} kind
 * @property {MapCoords} position
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
 * @typedef {'north' | 'south' | 'west' | 'east'} Direction
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
 *
 * @property {(x: number, z: number) => StagePropEntity} getStageProp
 * @property {(x: number, z: number) => PickupEntity} getPickup
 *
 * @property {(x: number, z: number) => boolean} isWalkable
 * @property {(x: number, z: number) => boolean} isVisionBlocker
 */
