/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('./game-state').PlayerState} PlayerState
 * @typedef {import('../../utils/audio-manager').AudioManagerApi} AudioManagerApi
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
  visibilityRayLookup,
} from '../../levels/common';
import { delay } from '../../utils/promise';
import { SfxIndex } from '../../utils/audio-manager';

export default class PlayerBehavior {
  #state;
  #enemyState;
  #pickupState;
  #mapUtils;
  #isTileWalkable;
  #getPickupAt;
  #getEnemyAt;
  #heal;
  #addAmmo;
  #damageEnemy;
  #exitLevel;
  #acquireKeycard;

  #audioMgr;

  #isAttackInCooldown;

  /**
   * @param {GameState} gs
   * @param {AudioManagerApi} audioMgr
   */
  constructor(gs, audioMgr) {
    const {
      state,
      mapUtils,
      isTileWalkableByPlayer,
      getPickupAt,
      getEnemyAt,
      healPlayer,
      addPlayerAmmo,
      damageEnemy,
      exitLevel,
      acquireKeycard,
    } = gs;

    this.#audioMgr = audioMgr;

    this.#state = state.player;
    this.#enemyState = state.enemies;
    this.#pickupState = state.pickups;
    this.#mapUtils = mapUtils;
    this.#isTileWalkable = isTileWalkableByPlayer;
    this.#getPickupAt = getPickupAt;
    this.#getEnemyAt = getEnemyAt;
    this.#heal = healPlayer;
    this.#addAmmo = addPlayerAmmo;
    this.#damageEnemy = damageEnemy;
    this.#exitLevel = exitLevel;
    this.#acquireKeycard = acquireKeycard;

    this.#isAttackInCooldown = false;
  }

  /**
   * @param {PlayerApi} view
   * @returns {() => void} Returns an unregister function.
   */
  register = view => {
    const {
      position: { x, z },
      look,
      health,
      ammo,
    } = this.#state;

    this.#state.view = view;
    this.#state.view.setMapPos(x, z);
    this.#state.view.setLook(look);
    this.#state.view.updateHudHealth(health);
    this.#state.view.updateHudAmmo(ammo);

    return () => {
      this.#state.view = null;
    };
  };

  attack = async () => {
    if (this.#isAttackInCooldown) return;

    if (this.#state.ammo <= 0) {
      // No more ammo!

      // Play SFX: "No Ammo"/"Gun empty"
      this.#audioMgr.playSfx(SfxIndex.gunEmpty);

      this.#isAttackInCooldown = false;
      return;
    }

    const {
      position: { x, z },
      look,
      attackDamage,
    } = this.#state;

    // Update ammo
    this.#addAmmo(-1);

    // Animate muzzle flash
    this.#state.view.flashMuzzle();

    // Play SFX: "Gun fire"
    this.#audioMgr.playSfx(SfxIndex.gunShot);

    // Animate player gun
    this.#state.view.recoilGun();

    const enemy = this.#getVisibleEnemy(x, z, look);
    if (enemy) {
      this.#damageEnemy(enemy.index, attackDamage);
    }

    this.#isAttackInCooldown = true;
    await delay(this.#state.attackCooldown);
    this.#isAttackInCooldown = false;
  };

  /**
   * @param {number} x
   * @param {number} z
   * @param {Direction} look
   */
  #getVisibleEnemy = (x, z, look) => {
    const visibilityRay = visibilityRayLookup[look](x, z);

    for (const v of visibilityRay) {
      if (this.#mapUtils.isVisionBlocker(v.x, v.y)) {
        // NO: No line of sight; vision obscured
        return null;
      }

      const enemy = this.#getEnemyAt(v.x, v.y);
      if (enemy) {
        // YES: Found a visible enemy
        return enemy;
      }
    }

    // NO: No enemy found along the ray
    return null;
  };

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
        // Play SFX: "Health pickup"
        this.#audioMgr.playSfx(SfxIndex.healthPickup);
        break;

      case PickupKind.ammo:
        this.#addAmmo(v);
        // Play SFX: "Ammo pickup"
        this.#audioMgr.playSfx(SfxIndex.ammoPickup);
        break;

      case PickupKind.key:
        this.#acquireKeycard();
        // Play SFX: "Key pickup"
        this.#audioMgr.playSfx(SfxIndex.keycardPickup);
        break;

      default:
        break;
    }

    // Add a bit of delay so it does not disappear right away
    await delay(150);
    pu.view.setVisibility(false);
  };

  #checkIfAtGoal = async () => {
    const {
      position: { x, z },
    } = this.#state;

    const atGoal = this.#mapUtils.isGoal(x, z);

    if (!atGoal) {
      return;
    }

    // Exit the level if already at the goal!
    await this.#exitLevel();
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

    // Play SFX: "Footsteps - turning"
    this.#audioMgr.playSfx(SfxIndex.playerFootsteps);

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

    // Play SFX: "Footsteps - turning"
    this.#audioMgr.playSfx(SfxIndex.playerFootsteps);

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

    // Play SFX: "Footsteps"
    this.#audioMgr.playSfx(SfxIndex.playerFootsteps);

    // Animate
    await view.moveForward(fromX, fromZ, look);

    await this.#checkIfAtGoal();
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

    // Play SFX: "Footsteps"
    this.#audioMgr.playSfx(SfxIndex.playerFootsteps);

    // Animate
    await view.moveBackward(fromX, fromZ, look);

    await this.#checkIfAtGoal();
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

    // Play SFX: "Footsteps"
    this.#audioMgr.playSfx(SfxIndex.playerFootsteps);

    // Animate
    await view.strafeLeft(fromX, fromZ, look);

    await this.#checkIfAtGoal();
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

    // Play SFX: "Footsteps"
    this.#audioMgr.playSfx(SfxIndex.playerFootsteps);

    // Animate
    await view.strafeRight(fromX, fromZ, look);

    await this.#checkIfAtGoal();
  };
}
