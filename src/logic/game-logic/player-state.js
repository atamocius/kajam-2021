/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 */

/**
 * @typedef {Object} PlayerState
 * @property {PlayerApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {boolean} isAnimating
 */

/**
 * @param {number} x
 * @param {number} z
 * @param {Direction} look
 * @returns {[state: PlayerState, helpers: PlayerStateHelpers]}
 */
export default function createState(x, z, look) {
  /** @type {PlayerState} */
  const state = {
    view: null,
    position: {
      x,
      z,
    },
    look,
    isAnimating: false,
  };

  const helpers = createHelpers(state);

  return [state, helpers];
}

/**
 * @typedef {Object} PlayerStateHelpers
 * @property {(x: number, z: number) => boolean} hasPlayerAt
 */

/**
 * @param {PlayerState} state
 * @returns {PlayerStateHelpers}
 */
function createHelpers(state) {
  /**
   * @param {number} x
   * @param {number} z
   */
  const hasPlayerAt = (x, z) =>
    state.position.x === x && state.position.z === z;

  return {
    hasPlayerAt,
  };
}
