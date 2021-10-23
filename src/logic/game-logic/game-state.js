/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
 * @typedef {import('../../components/pickups').PickupApi} PickupApi
 * @typedef {import('../../utils/level-loader/types').LoadedLevelData} LoadedLevelData
 * @typedef {import('../../utils/level-loader/types').EnemyEntity} EnemyEntity
 * @typedef {import('../../utils/level-loader/types').PickupEntity} PickupEntity
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').PlayerStartData} PlayerStartData
 */

/**
 * @typedef {Object} State
 * @property {PlayerState} player
 * @property {EnemyState[]} enemies
 * @property {PickupState[]} pickups
 */

/**
 * @typedef {Object} PlayerState
 * @property {PlayerApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 */

/**
 * @typedef {Object} EnemyState
 * @property {number} index
 * @property {EnemyApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {string} kind
 * @property {number} sightRange
 * @property {number} healthClass
 * @property {number} speedClass
 */

/**
 * @typedef {Object} PickupState
 * @property {number} index
 * @property {PickupApi} view
 * @property {MapCoords} position
 * @property {string} kind
 * @property {boolean} enabled
 */

import { delay } from '../../utils/promise';

export default class GameState {
  #state;
  #mapUtils;

  /**
   * @param {LoadedLevelData} level
   */
  constructor(level) {
    const { logic, utils } = level;
    const {
      start,
      goal,
      entities: { enemies, pickups },
    } = logic;

    this.#mapUtils = utils;

    this.#state = {
      player: this.#createPlayerState(start),
      enemies: enemies.map(this.#createEnemyState),
      pickups: pickups.map(this.#createPickupState),
    };
  }

  /**
   * @returns {State}
   */
  get state() {
    return this.#state;
  }

  get mapUtils() {
    return this.#mapUtils;
  }

  /**
   * @param {number} x
   * @param {number} z
   */
  hasPlayerAt = (x, z) =>
    this.#state.player.position.x === x && this.#state.player.position.z === z;

  /**
   * @param {number} x
   * @param {number} z
   */
  hasEnemyAt = (x, z) =>
    this.#state.enemies.some(e => e.position.x === x && e.position.z === z);

  /**
   * @param {number} x
   * @param {number} z
   */
  getEnemyAt = (x, z) =>
    this.#state.enemies.find(e => e.position.x === x && e.position.z === z);

  /**
   * @param {number} x
   * @param {number} z
   */
  getPickupAt = (x, z) =>
    this.#state.pickups.find(p => p.position.x === x && p.position.z === z);

  /**
   * @param {number} x
   * @param {number} z
   */
  consumePickupAt = async (x, z) => {
    const pu = this.getPickupAt(x, z);
    if (!pu || !pu.enabled) return;
    pu.enabled = false;
    // TODO: Do calculations and state updates

    // Add a bit of delay so it does not disappear right away
    await delay(150);
    pu.view.setVisibility(false);
  };

  /**
   * @param {number} x
   * @param {number} z
   */
  isTileWalkableByPlayer = (x, z) => {
    return this.#mapUtils.isWalkable(x, z) && !this.hasEnemyAt(x, z);
  };

  /**
   * @param {number} x
   * @param {number} z
   */
  isTileWalkableByEnemy = (x, z) => {
    return (
      this.#mapUtils.isWalkable(x, z) &&
      // !this.hasPlayerAt(x, z) &&
      !this.hasEnemyAt(x, z)
    );
  };

  /**
   * @param {PlayerStartData} start
   */
  #createPlayerState = start => {
    const { x, z, look } = start;

    /** @type {PlayerState} */
    const state = {
      view: null,
      position: {
        x,
        z,
      },
      look,
    };

    return state;
  };

  /**
   * @param {EnemyEntity} entity
   * @param {number} index
   */
  #createEnemyState = (entity, index) => {
    const {
      position: { x, z },
      look,
      kind,
      sightRange,
      healthClass,
      speedClass,
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
      kind,
      sightRange,
      healthClass,
      speedClass,
    };

    return state;
  };

  /**
   * @param {PickupEntity} entity
   * @param {number} index
   */
  #createPickupState = (entity, index) => {
    const {
      position: { x, z },
      kind,
    } = entity;

    /** @type {PickupState} */
    const state = {
      index,
      view: null,
      position: {
        x,
        z,
      },
      kind,
      enabled: true,
    };

    return state;
  };
}
