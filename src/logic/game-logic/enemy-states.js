/**
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
 * @typedef {import('../../utils/level-loader/types').EnemyEntity} EnemyEntity
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 */

/**
 * @typedef {Object} EnemyState
 * @property {number} index
 * @property {EnemyApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {number} sightRange
 * @property {boolean} isAnimating
 */

/**
 * @param {EnemyEntity[]} entities
 * @returns {[states: EnemyState[], helpers: EnemyStatesHelpers]}
 */
export default function createStates(entities) {
  const states = entities.map(createState);
  const helpers = createHelpers(states);
  return [states, helpers];
}

/**
 * @param {EnemyEntity} entity
 * @param {number} index
 */
function createState(entity, index) {
  const {
    position: { x, z },
    look,
    sightRange,
  } = entity;

  /** @type {EnemyState} */
  const state = {
    index,
    view: null,
    position: {
      x,
      z,
    },
    look,
    sightRange,
    isAnimating: false,
  };

  return state;
}

/**
 * @typedef {Object} EnemyStatesHelpers
 * @property {(x: number, z: number) => boolean} hasEnemyAt
 * @property {(x: number, z: number) => EnemyState} getEnemyAt
 */

/**
 * @param {EnemyState[]} states
 * @returns {EnemyStatesHelpers}
 */
function createHelpers(states) {
  /**
   * @param {number} x
   * @param {number} z
   */
  const hasEnemyAt = (x, z) =>
    states.some(e => e.position.x === x && e.position.z === z);

  /**
   * @param {number} x
   * @param {number} z
   */
  const getEnemyAt = (x, z) =>
    states.find(e => e.position.x === x && e.position.z === z);

  return {
    hasEnemyAt,
    getEnemyAt,
  };
}
