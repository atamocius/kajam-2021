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
 * @property {number} attackCooldown
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
 * @property {boolean} enabled
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

import { healthClassLookup, MAX_HEALTH, MAX_AMMO } from '../../levels/common';

const PLAYER_ATTACK_COOLDOWN_MS = 200;

export default class GameState {
  #state;
  #mapUtils;

  #gameOverEvent;
  #exitLevelEvent;

  /**
   * @param {LoadedLevelData} level
   */
  constructor(level) {
    const { logic, utils } = level;
    const {
      start,
      entities: { enemies, pickups },
    } = logic;

    this.#mapUtils = utils;

    this.#gameOverEvent = new Event('gameOver');
    this.#exitLevelEvent = new Event('exitLevel');

    this.#state = {
      isGameOver: false,
      hasExitedLevel: false,
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

  hasExitedLevel = () => {
    return this.#state.hasExitedLevel;
  };

  /**
   * @param {() => void} listener
   * @returns {() => void} Unsubscribe function.
   */
  addGameOverListener = listener => {
    document.addEventListener('gameOver', listener, false);
    return () => document.removeEventListener('gameOver', listener, false);
  };

  /**
   * @param {() => void} listener
   * @returns {() => void} Unsubscribe function.
   */
  addExitLevelListener = listener => {
    document.addEventListener('exitLevel', listener, false);
    return () => document.removeEventListener('exitLevel', listener, false);
  };

  gameOver = () => {
    if (this.#state.isGameOver) {
      return;
    }
    this.#state.isGameOver = true;
    document.dispatchEvent(this.#gameOverEvent);
  };

  exitLevel = () => {
    if (this.#state.hasExitedLevel) {
      return;
    }
    this.#state.hasExitedLevel = true;
    document.dispatchEvent(this.#exitLevelEvent);
  };

  updatePlayerHud = () => {
    const { health, ammo, view } = this.#state.player;
    view.updateHudHealth(health);
    view.updateHudAmmo(ammo);
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

    // Update HUD
    this.updatePlayerHud();
  };

  /**
   * @param {number} d
   */
  damagePlayer = d => {
    const { player } = this.#state;
    const t = player.health - d;
    player.health = clamp(t, 0, MAX_HEALTH);

    // Update HUD
    this.updatePlayerHud();

    if (t <= 0) {
      // TODO: Play SFX: "Player death"
      this.gameOver();
      return;
    }

    // TODO: Play SFX: "Player damaged"

    // Animate damage indicator
    player.view.indicateDamage();
  };

  /**
   * @param {number} index
   * @param {number} damage
   */
  damageEnemy = async (index, damage) => {
    const { enemies } = this.#state;
    const enemy = enemies[index];
    const { enabled } = enemy;

    if (!enabled) {
      return;
    }

    const t = enemy.health - damage;
    enemy.health = clamp(t, 0, MAX_HEALTH);

    // TODO: Play SFX: "Enemy damaged"

    // Animate hit!
    await enemy.view.damage();

    if (enemy.health > 0) {
      return;
    }

    // Disable the enemy if it is dead
    enemy.enabled = false;

    // TODO: Play SFX: "Enemy death"

    // Animate death!
    await enemy.view.death();
    enemy.view.setVisibility(false);
  };

  /**
   * @param {number} a
   */
  addPlayerAmmo = a => {
    const { player } = this.#state;
    const t = player.ammo + a;
    player.ammo = clamp(t, 0, MAX_AMMO);

    // Update HUD
    this.updatePlayerHud();
  };

  /**
   * @param {number} x
   * @param {number} z
   */
  hasEnemyAt = (x, z) =>
    this.#state.enemies.some(
      e => e.enabled && e.position.x === x && e.position.z === z
    );

  /**
   * @param {number} x
   * @param {number} z
   */
  getEnemyAt = (x, z) =>
    this.#state.enemies.find(
      e => e.enabled && e.position.x === x && e.position.z === z
    );

  /**
   * @param {number} x
   * @param {number} z
   */
  getPickupAt = (x, z) =>
    this.#state.pickups.find(
      p => p.enabled && p.position.x === x && p.position.z === z
    );

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
      attackCooldown: PLAYER_ATTACK_COOLDOWN_MS,
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
      enabled: true,
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
