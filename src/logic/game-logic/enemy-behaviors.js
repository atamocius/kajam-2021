/**
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./player-state').PlayerState} PlayerState
 * @typedef {import('./player-state').PlayerStateHelpers} PlayerStateHelpers
 * @typedef {import('./enemy-states').EnemyState} EnemyState
 * @typedef {import('./enemy-states').EnemyStatesHelpers} EnemyStatesHelpers
 */

import GameState from './game-state';
import { Direction } from '../../utils/level-loader/common';
import {
  rotationRightLookup,
  rotationLeftLookup,
  moveForwardOffsetLookup,
  moveBackwardOffsetLookup,
  strafeRightOffsetLookup,
  strafeLeftOffsetLookup,
} from '../../levels/common';

export default class EnemyBehaviors {
  #behaviors;

  /**
   * @param {GameState} gs
   */
  constructor(gs) {
    this.#behaviors = gs.state.enemies.map(s => new EnemyBehavior(s, gs));
  }

  /**
   * @param {number} index
   */
  get(index) {
    return this.#behaviors[index];
  }
}

export class EnemyBehavior {
  #state;
  #mutex;
  #isTileWalkable;

  /**
   * @param {EnemyState} state
   * @param {GameState} gs
   */
  constructor(state, gs) {
    const { mutex, isTileWalkableByEnemy } = gs;

    this.#state = state;
    this.#mutex = mutex;
    this.#isTileWalkable = isTileWalkableByEnemy;
  }

  /**
   * @param {EnemyApi} view
   * @returns {() => void} Returns an unregister function.
   */
  register = view => {
    const {
      position: { x, z },
      look,
    } = this.#state;
    this.#state.view = view;
    this.#state.view.setMapPos(x, z);
    this.#state.view.setLook(look);

    return () => {
      this.#state.view = null;
    };
  };

  /**
   * @param {number} x
   * @param {number} z
   */
  setPosition = (x, z) => {
    this.#state.view.setMapPos(x, z);
    this.#state.position.x = x;
    this.#state.position.z = z;
  };

  /**
   * @param {Direction} look
   */
  setLook = look => {
    this.#state.view.setLook(look);
    this.#state.look = look;
  };

  rotateLeft = async () => {
    const {
      position: { x, z },
      look,
      view,
    } = this.#state;

    const fromLook = look;
    const toLook = rotationLeftLookup[look];

    // Update prior to animate
    this.#state.look = toLook;

    // Animate
    await view.rotateLeft(x, z, fromLook);
  };

  rotateRight = async () => {
    const {
      position: { x, z },
      look,
      view,
    } = this.#state;

    const fromLook = look;
    const toLook = rotationRightLookup[look];

    // Update prior to animate
    this.#state.look = toLook;

    // Animate
    await view.rotateRight(x, z, fromLook);
  };

  moveForward = async () =>
    this.#mutex.runExclusive(async () => {
      const { position, look, view } = this.#state;

      const { x, z } = moveForwardOffsetLookup[look];

      const fromX = position.x;
      const fromZ = position.z;
      const toX = fromX + x;
      const toZ = fromZ + z;

      if (!this.#isTileWalkable(toX, toZ)) {
        return;
      }

      // Update prior to animate
      this.#state.position.x = toX;
      this.#state.position.z = toZ;

      // Animate
      await view.moveForward(fromX, fromZ, look);
    });

  moveBackward = async () =>
    this.#mutex.runExclusive(async () => {
      const { position, look, view } = this.#state;

      const { x, z } = moveBackwardOffsetLookup[look];

      const fromX = position.x;
      const fromZ = position.z;
      const toX = fromX + x;
      const toZ = fromZ + z;

      if (!this.#isTileWalkable(toX, toZ)) {
        return;
      }

      // Update prior to animate
      this.#state.position.x = toX;
      this.#state.position.z = toZ;

      // Animate
      await view.moveBackward(fromX, fromZ, look);
    });

  strafeLeft = async () =>
    this.#mutex.runExclusive(async () => {
      const { position, look, view } = this.#state;

      const { x, z } = strafeLeftOffsetLookup[look];

      const fromX = position.x;
      const fromZ = position.z;
      const toX = fromX + x;
      const toZ = fromZ + z;

      if (!this.#isTileWalkable(toX, toZ)) {
        return;
      }

      // Update prior to animate
      this.#state.position.x = toX;
      this.#state.position.z = toZ;

      // Animate
      await view.strafeLeft(fromX, fromZ, look);
    });

  strafeRight = async () =>
    this.#mutex.runExclusive(async () => {
      const { position, look, view } = this.#state;

      const { x, z } = strafeRightOffsetLookup[look];

      const fromX = position.x;
      const fromZ = position.z;
      const toX = fromX + x;
      const toZ = fromZ + z;

      if (!this.#isTileWalkable(toX, toZ)) {
        return;
      }

      // Update prior to animate
      this.#state.position.x = toX;
      this.#state.position.z = toZ;

      // Animate
      await view.strafeRight(fromX, fromZ, look);
    });
}
