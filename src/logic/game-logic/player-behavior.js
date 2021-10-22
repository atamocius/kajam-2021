/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./index').PlayerState} PlayerState
 * @typedef {import('./index').EnemyState} EnemyState
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

export default class PlayerBehavior {
  #state;
  #enemyState;
  #mapUtils;

  /**
   * @param {PlayerState} state
   * @param {EnemyState} enemyState
   * @param {MapUtilFuncs} mapUtils
   */
  constructor(state, enemyState, mapUtils) {
    this.#state = state;
    this.#enemyState = enemyState;
    this.#mapUtils = mapUtils;
  }

  /**
   * @param {PlayerApi} view
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

  /**
   * @param {number} x
   * @param {number} z
   * @returns
   */
  isTileWalkable = (x, z) => {
    // TODO: Check enemy positions
    return this.#mapUtils.isWalkable(x, z);
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

    if (!this.isTileWalkable(toX, toZ)) {
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

    if (!this.isTileWalkable(toX, toZ)) {
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

    if (!this.isTileWalkable(toX, toZ)) {
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

    if (!this.isTileWalkable(toX, toZ)) {
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
