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
 * @typedef {import('../../utils/audio-manager').AudioManagerApi} AudioManagerApi
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
 * @property {boolean} hasKey
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
import { SfxIndex } from '../../utils/audio-manager';
import { delay } from '../../utils/promise';

const PLAYER_ATTACK_COOLDOWN_MS = 300;

export default class GameState {
  #state;
  #mapUtils;

  #gameOverEvent;
  #keyAcquiredEvent;
  #exitedLevelEvent;

  #audioMgr;

  #enemyAudioApis;

  /**
   * @param {LoadedLevelData} level
   * @param {AudioManagerApi} audioMgr
   */
  constructor(level, audioMgr) {
    const { logic, utils } = level;
    const {
      start,
      entities: { enemies, pickups },
    } = logic;

    this.#mapUtils = utils;

    this.#audioMgr = audioMgr;
    this.#enemyAudioApis = [];

    this.#gameOverEvent = new Event('gameOver');
    this.#keyAcquiredEvent = new Event('keyAcquired');
    this.#exitedLevelEvent = new Event('exitedLevel');

    this.#state = {
      isGameOver: false,
      hasExitedLevel: false,
      player: this.#createPlayerState(start),
      enemies: enemies.map(this.#createEnemyState),
      pickups: pickups.map(this.#createPickupState),
    };
  }

  registerEnemyAudioApis = enemyAudioApis =>
    (this.#enemyAudioApis = enemyAudioApis);

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
  addKeyAcquiredListener = listener => {
    document.addEventListener('keyAcquired', listener, false);
    return () => document.removeEventListener('keyAcquired', listener, false);
  };

  /**
   * @param {() => void} listener
   * @returns {() => void} Unsubscribe function.
   */
  addExitedLevelListener = listener => {
    document.addEventListener('exitedLevel', listener, false);
    return () => document.removeEventListener('exitedLevel', listener, false);
  };

  gameOver = () => {
    if (this.#state.isGameOver) {
      return;
    }
    this.#state.isGameOver = true;
    document.dispatchEvent(this.#gameOverEvent);
  };

  exitLevel = async () => {
    if (this.#state.hasExitedLevel) {
      return;
    }
    if (!this.#state.player.hasKey) {
      this.#state.player.view.showHudDangerMessage('Access Card Required');
      // Play SFX: "Access Denied"
      this.#audioMgr.playSfx(SfxIndex.accessDenied);
      return;
    }

    // Play SFX: "Access Grantes"
    this.#audioMgr.playSfx(SfxIndex.accessGranted);

    await delay(1500);

    this.#state.hasExitedLevel = true;
    document.dispatchEvent(this.#exitedLevelEvent);
  };

  acquireKeycard = () => {
    const { player } = this.#state;
    player.hasKey = true;
    document.dispatchEvent(this.#keyAcquiredEvent);
    player.view.showHudSuccessMessage('Access Card Acquired');
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
  damagePlayer = async d => {
    if (this.#state.player.health <= 0) return;

    const { player } = this.#state;
    const t = player.health - d;
    player.health = clamp(t, 0, MAX_HEALTH);

    // Update HUD
    this.updatePlayerHud();

    if (t <= 0) {
      // Play SFX: "Player death"
      this.#audioMgr.playSfx(SfxIndex.playerDeath);

      await delay(1500);

      this.gameOver();
      return;
    }

    // Play SFX: "Player damaged"
    this.#audioMgr.playSfx(SfxIndex.playerDamaged);

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

    // Play SFX: "Enemy damaged"
    this.#enemyAudioApis[enemy.index].playDamagedSfx();

    // Animate hit!
    await enemy.view.damage();

    if (enemy.health > 0) {
      return;
    }

    // Disable the enemy if it is dead
    enemy.enabled = false;

    // Play SFX: "Enemy death"
    this.#enemyAudioApis[enemy.index].playDeathSfx();

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
      health: 100,
      ammo: 15,
      attackDamage: 1,
      attackCooldown: PLAYER_ATTACK_COOLDOWN_MS,
      hasKey: false,
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
      attackDamage: 10,
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
