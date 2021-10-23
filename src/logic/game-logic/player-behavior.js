/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('./game-state').PlayerState} PlayerState
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
  PickupKind,
  pickupDataLookup,
  MAX_HEALTH,
  MAX_AMMO,
} from '../../levels/common';
import { distance, line } from '../../utils/math';
import { delay } from '../../utils/promise';

export default class PlayerBehavior {
  #state;
  #enemyState;
  #pickupState;
  #mapUtils;
  #isTileWalkable;
  #getPickupAt;
  #heal;
  #addAmmo;

  /**
   * @param {GameState} gs
   */
  constructor(gs) {
    const {
      state,
      mapUtils,
      isTileWalkableByPlayer,
      getPickupAt,
      healPlayer,
      addPlayerAmmo,
    } = gs;

    this.#state = state.player;
    this.#enemyState = state.enemies;
    this.#pickupState = state.pickups;
    this.#mapUtils = mapUtils;
    this.#isTileWalkable = isTileWalkableByPlayer;
    this.#getPickupAt = getPickupAt;
    this.#heal = healPlayer;
    this.#addAmmo = addPlayerAmmo;
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

  // canSeePlayer = () => {
  //   const {
  //     position: { x: px, z: pz },
  //   } = this.#playerState;
  //   const {
  //     position: { x, z },
  //   } = this.#state;

  //   const visibilityLine = line({ x, y: z }, { x: px, y: pz });
  //   for (const v of visibilityLine) {
  //     if (this.#mapUtils.isVisionBlocker(v.x, v.y)) {
  //       // NO: No line of sight; vision obscured
  //       return false;
  //     }

  //     // Is current tile the same position as the player?
  //     if (v.x === px && v.y === pz) {
  //       // YES: Has line of sight
  //       return true;
  //     }
  //   }

  //   // NO: No line of sight
  //   return false;
  // };

  /**
   * @param {number} x
   * @param {number} z
   */
  #consumePickupAt = async (x, z) => {
    const pu = this.#getPickupAt(x, z);
    if (!pu || !pu.enabled) return;
    pu.enabled = false;

    const v = pickupDataLookup[pu.kind].value;
    switch (pu.kind) {
      case PickupKind.health:
        this.#heal(v);
        break;

      case PickupKind.ammo:
        this.#addAmmo(v);
        break;

      default:
        break;
    }

    // Add a bit of delay so it does not disappear right away
    await delay(150);
    pu.view.setVisibility(false);
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

  moveForward = async () => {
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

    // Consume any pickups
    this.#consumePickupAt(toX, toZ);

    // Animate
    await view.moveForward(fromX, fromZ, look);
  };

  moveBackward = async () => {
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

    // Consume any pickups
    this.#consumePickupAt(toX, toZ);

    // Animate
    await view.moveBackward(fromX, fromZ, look);
  };

  strafeLeft = async () => {
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

    // Consume any pickups
    this.#consumePickupAt(toX, toZ);

    // Animate
    await view.strafeLeft(fromX, fromZ, look);
  };

  strafeRight = async () => {
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

    // Consume any pickups
    this.#consumePickupAt(toX, toZ);

    // Animate
    await view.strafeRight(fromX, fromZ, look);
  };
}
