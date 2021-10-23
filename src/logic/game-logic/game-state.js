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
 * @property {boolean} isGameOver
 * @property {PlayerState} player
 * @property {EnemyState[]} enemies
 * @property {PickupState[]} pickups
 */

/**
 * @typedef {Object} PlayerState
 * @property {PlayerApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {number} health
 * @property {number} ammo
 * @property {number} attackDamage
 */

/**
 * @typedef {Object} EnemyState
 * @property {number} index
 * @property {EnemyApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {string} kind
 * @property {number} health
 * @property {number} attackDamage
 */

/**
 * @typedef {Object} PickupState
 * @property {number} index
 * @property {PickupApi} view
 * @property {MapCoords} position
 * @property {string} kind
 * @property {boolean} enabled
 */

import clamp from 'lodash-es/clamp';

import { delay } from '../../utils/promise';
import {
  healthClassLookup,
  PickupKind,
  pickupDataLookup,
  MAX_HEALTH,
  MAX_AMMO,
} from '../../levels/common';

export default class GameState {
  #state;
  #mapUtils;

  #gameOverEvent;

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

    this.#gameOverEvent = new Event('gameOver');

    this.#state = {
      isGameOver: false,
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

  isGameOver = () => {
    return this.#state.isGameOver;
  };

  /**
   * @param {() => void} listener
   * @returns {() => void} Unsubscribe function.
   */
  addGameOverListener = listener => {
    document.addEventListener('gameOver', listener, false);
    return () => document.removeEventListener('gameOver', listener, false);
  };

  gameOver = () => {
    if (this.#state.isGameOver) {
      return;
    }
    this.#state.isGameOver = true;
    document.dispatchEvent(this.#gameOverEvent);
  };

  /**
   * @param {number} x
   * @param {number} z
   */
  hasPlayerAt = (x, z) =>
    this.#state.player.position.x === x && this.#state.player.position.z === z;

  /**
   * @param {number} h
   */
  healPlayer = h => {
    const { player } = this.#state;
    const t = player.health + h;
    player.health = clamp(t, 0, MAX_HEALTH);
  };

  /**
   * @param {number} d
   */
  damagePlayer = d => {
    const { player } = this.#state;
    const t = player.health - d;
    if (t <= 0) {
      this.gameOver();
    }
    player.health = clamp(t, 0, MAX_HEALTH);
  };

  /**
   * @param {number} a
   */
  addPlayerAmmo = a => {
    const { player } = this.#state;
    const t = player.ammo + a;
    player.ammo = clamp(t, 0, MAX_AMMO);
  };

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

  // /**
  //  * @param {number} x
  //  * @param {number} z
  //  */
  // consumePickupAt = async (x, z) => {
  //   const pu = this.getPickupAt(x, z);
  //   if (!pu || !pu.enabled) return;
  //   pu.enabled = false;
  //   // TODO: Do calculations and state updates

  //   // const v = pickupDataLookup[pu.kind].value;
  //   // switch (pu.kind) {
  //   //   case PickupKind.health:
  //   //     this.healPlayer()
  //   //     break;

  //   //   case PickupKind.health:
  //   //     break;

  //   //   default:
  //   //     break;
  //   // }

  //   // Add a bit of delay so it does not disappear right away
  //   await delay(150);
  //   pu.view.setVisibility(false);
  // };

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
      health: 20,
      ammo: 15,
      attackDamage: 1,
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
      healthClass,
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
      health: healthClassLookup[healthClass],
      attackDamage: 1,
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
