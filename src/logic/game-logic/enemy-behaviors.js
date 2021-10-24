/**
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('./game-state').EnemyState} EnemyState
 */

import minBy from 'lodash-es/minBy';

import GameState from './game-state';
import { Direction } from '../../utils/level-loader/common';
import {
  neighborOffsetLookup,
  rotationRightLookup,
  rotationLeftLookup,
  moveForwardOffsetLookup,
  moveBackwardOffsetLookup,
  strafeRightOffsetLookup,
  strafeLeftOffsetLookup,
} from '../../levels/common';
import { distance } from '../../utils/math';
import { delay } from '../../utils/promise';

const THINKING_DELAY = 300;

export default class EnemyBehaviors {
  #behaviors;
  #busy;

  /**
   * @param {GameState} gs
   */
  constructor(gs) {
    this.#behaviors = gs.state.enemies.map(s => new EnemyBehavior(s, gs));

    this.#busy = false;
  }

  /**
   * @param {number} index
   */
  get = index => {
    return this.#behaviors[index];
  };

  get isBusy() {
    return this.#busy;
  }

  async moveTowardsPlayer() {
    this.#busy = true;
    const p = this.#behaviors.map(b => b.moveTowardsPlayer());
    await Promise.all(p);
    this.#busy = false;
  }
}

export class EnemyBehavior {
  #state;
  #playerState;
  #mapUtils;
  #isTileWalkable;
  #rotationTable;
  #damagePlayer;

  /**
   * @param {EnemyState} state
   * @param {GameState} gs
   */
  constructor(state, gs) {
    const {
      state: { player },
      mapUtils,
      isTileWalkableByEnemy,
      damagePlayer,
    } = gs;

    this.#state = state;
    this.#playerState = player;
    this.#mapUtils = mapUtils;
    this.#isTileWalkable = isTileWalkableByEnemy;
    this.#damagePlayer = damagePlayer;

    this.#rotationTable = {
      [Direction.north]: {
        [Direction.north]: [],
        [Direction.south]: [this.rotateRight, this.rotateRight],
        [Direction.west]: [this.rotateLeft],
        [Direction.east]: [this.rotateRight],
      },
      [Direction.south]: {
        [Direction.north]: [this.rotateRight, this.rotateRight],
        [Direction.south]: [],
        [Direction.west]: [this.rotateRight],
        [Direction.east]: [this.rotateLeft],
      },
      [Direction.west]: {
        [Direction.north]: [this.rotateRight],
        [Direction.south]: [this.rotateLeft],
        [Direction.west]: [],
        [Direction.east]: [this.rotateRight, this.rotateRight],
      },
      [Direction.east]: {
        [Direction.north]: [this.rotateLeft],
        [Direction.south]: [this.rotateRight],
        [Direction.west]: [this.rotateRight, this.rotateRight],
        [Direction.east]: [],
      },
    };
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

  attack = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    const {
      position: { x, z },
      look,
      view,
      attackDamage,
    } = this.#state;

    this.#damagePlayer(attackDamage);

    // Animate
    await view.attack(x, z, look);
  };

  #neighbors = (x, z) => {
    const result = [];

    {
      const o = neighborOffsetLookup[Direction.north];
      if (this.#isTileWalkable(x + o.x, z + o.z)) {
        result.push({
          dir: Direction.north,
          offset: o,
        });
      }
    }

    {
      const o = neighborOffsetLookup[Direction.south];
      if (this.#isTileWalkable(x + o.x, z + o.z)) {
        result.push({
          dir: Direction.south,
          offset: o,
        });
      }
    }

    {
      const o = neighborOffsetLookup[Direction.west];
      if (this.#isTileWalkable(x + o.x, z + o.z)) {
        result.push({
          dir: Direction.west,
          offset: o,
        });
      }
    }

    {
      const o = neighborOffsetLookup[Direction.east];
      if (this.#isTileWalkable(x + o.x, z + o.z)) {
        result.push({
          dir: Direction.east,
          offset: o,
        });
      }
    }

    return result;
  };

  /**
   * @param {Direction} dir
   */
  rotateTowards = async dir => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    const { look } = this.#state;

    // Rotate to orient towards target direction
    const rotations = this.#rotationTable[look][dir];
    for (const r of rotations) {
      await r();
    }
  };

  moveTowardsPlayer = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    // Exit if there is no view registered yet
    if (!this.#state.view) return;

    // Thinking time
    await delay(THINKING_DELAY);

    const { position: playerPos } = this.#playerState;
    const {
      position: { x, z },
    } = this.#state;

    const neighbors = this.#neighbors(x, z);

    // Exit if there are no neighbors
    if (neighbors.length === 0) return;

    const scores = neighbors.map(({ dir, offset: o }) => {
      const score = distance(x + o.x, z + o.z, playerPos.x, playerPos.z);
      return {
        dir,
        score,
        pos: { x: x + o.x, z: z + o.z },
      };
    });

    const lowest = minBy(scores, o => o.score);

    // Orient towards next position
    await this.rotateTowards(lowest.dir);

    // If lowest.pos === playerPos, do an attack instead
    if (lowest.pos.x === playerPos.x && lowest.pos.z === playerPos.z) {
      await this.attack();
    } else {
      await this.moveForward();
    }
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
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    this.#state.isInvulnerable = true;

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

    this.#state.isInvulnerable = false;
  };

  rotateRight = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    this.#state.isInvulnerable = true;

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

    this.#state.isInvulnerable = false;
  };

  moveForward = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    this.#state.isInvulnerable = true;

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

    this.#state.isInvulnerable = false;
  };

  moveBackward = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    this.#state.isInvulnerable = true;

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

    this.#state.isInvulnerable = false;
  };

  strafeLeft = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    this.#state.isInvulnerable = true;

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

    this.#state.isInvulnerable = false;
  };

  strafeRight = async () => {
    // Exit if it is disabled
    if (!this.#state.enabled) return;

    this.#state.isInvulnerable = true;

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

    this.#state.isInvulnerable = false;
  };
}
