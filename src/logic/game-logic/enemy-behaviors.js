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
  // #states;
  #behaviors;
  #helpers;
  // #playerState;
  #playerStateHelpers;
  #mapUtils;

  /**
   * @param {EnemyState[]} states
   * @param {EnemyStatesHelpers} helpers
   * @param {PlayerState} playerState
   * @param {PlayerStateHelpers} playerStateHelpers
   * @param {MapUtilFuncs} mapUtils
   */
  constructor(states, helpers, playerState, playerStateHelpers, mapUtils) {
    // this.#states = states;
    this.#behaviors = states.map(
      s => new EnemyBehavior(s, this.isTileWalkable)
    );
    this.#helpers = helpers;
    // this.#playerState = playerState;
    this.#playerStateHelpers = playerStateHelpers;
    this.#mapUtils = mapUtils;
  }

  /**
   * @param {number} index
   * @param {EnemyApi} view
   * @returns {() => void} Returns an unregister function.
   */
  register = (index, view) => {
    return this.#behaviors[index].register(view);
  };

  /**
   * @param {number} index
   * @param {number} x
   * @param {number} z
   */
  setPosition = (index, x, z) => {
    this.#behaviors[index].setPosition(x, z);
  };

  /**
   * @param {number} index
   * @param {Direction} look
   */
  setLook = (index, look) => {
    this.#behaviors[index].setLook(look);
  };

  /**
   * @param {number} x
   * @param {number} z
   */
  isTileWalkable = (x, z) => {
    return (
      this.#mapUtils.isWalkable(x, z) &&
      !this.#playerStateHelpers.hasPlayerAt(x, z) &&
      !this.#helpers.hasEnemyAt(x, z)
    );
  };

  /**
   * @param {number} index
   */
  rotateLeft = async index => {
    await this.#behaviors[index].rotateLeft();
  };

  /**
   * @param {number} index
   */
  rotateRight = async index => {
    await this.#behaviors[index].rotateRight();
  };

  /**
   * @param {number} index
   */
  moveForward = async index => {
    await this.#behaviors[index].moveForward();
  };

  /**
   * @param {number} index
   */
  moveBackward = async index => {
    await this.#behaviors[index].moveBackward();
  };

  /**
   * @param {number} index
   */
  strafeLeft = async index => {
    await this.#behaviors[index].strafeLeft();
  };

  /**
   * @param {number} index
   */
  strafeRight = async index => {
    await this.#behaviors[index].strafeRight();
  };
}

export class EnemyBehavior {
  #state;
  // #helpers;
  // #playerState;
  // #playerStateHelpers;
  // #mapUtils;

  #isTileWalkable;

  /**
   * @param {EnemyState} state
   * @param {(x: number, z: number) => boolean} isTileWalkable
   */
  constructor(
    state,
    // helpers,
    // playerState,
    // playerStateHelpers,
    // mapUtils,
    isTileWalkable
  ) {
    this.#state = state;
    // this.#helpers = helpers;
    // this.#playerState = playerState;
    // this.#playerStateHelpers = playerStateHelpers;
    // this.#mapUtils = mapUtils;

    this.#isTileWalkable = isTileWalkable;
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
    if (this.#state.isAnimating) return;
    this.#state.isAnimating = true;

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

    this.#state.isAnimating = false;
  };

  rotateRight = async () => {
    if (this.#state.isAnimating) return;
    this.#state.isAnimating = true;

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

    this.#state.isAnimating = false;
  };

  moveForward = async () => {
    if (this.#state.isAnimating) return;
    this.#state.isAnimating = true;

    const { position, look, view } = this.#state;

    const { x, z } = moveForwardOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!this.#isTileWalkable(toX, toZ)) {
      this.#state.isAnimating = false;
      return;
    }

    // Update prior to animate
    this.#state.position.x = toX;
    this.#state.position.z = toZ;

    // Animate
    await view.moveForward(fromX, fromZ, look);

    this.#state.isAnimating = false;
  };

  moveBackward = async () => {
    if (this.#state.isAnimating) return;
    this.#state.isAnimating = true;

    const { position, look, view } = this.#state;

    const { x, z } = moveBackwardOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!this.#isTileWalkable(toX, toZ)) {
      this.#state.isAnimating = false;
      return;
    }

    // Update prior to animate
    this.#state.position.x = toX;
    this.#state.position.z = toZ;

    // Animate
    await view.moveBackward(fromX, fromZ, look);

    this.#state.isAnimating = false;
  };

  strafeLeft = async () => {
    if (this.#state.isAnimating) return;
    this.#state.isAnimating = true;

    const { position, look, view } = this.#state;

    const { x, z } = strafeLeftOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!this.#isTileWalkable(toX, toZ)) {
      this.#state.isAnimating = false;
      return;
    }

    // Update prior to animate
    this.#state.position.x = toX;
    this.#state.position.z = toZ;

    // Animate
    await view.strafeLeft(fromX, fromZ, look);

    this.#state.isAnimating = false;
  };

  strafeRight = async () => {
    if (this.#state.isAnimating) return;
    this.#state.isAnimating = true;

    const { position, look, view } = this.#state;

    const { x, z } = strafeRightOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!this.#isTileWalkable(toX, toZ)) {
      this.#state.isAnimating = false;
      return;
    }

    // Update prior to animate
    this.#state.position.x = toX;
    this.#state.position.z = toZ;

    // Animate
    await view.strafeRight(fromX, fromZ, look);

    this.#state.isAnimating = false;
  };
}
