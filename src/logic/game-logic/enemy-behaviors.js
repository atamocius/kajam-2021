/**
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./game-state').EnemyState} EnemyState
 * @typedef {import('../../utils/math').Point} Point
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
import { distance, line } from '../../utils/math';

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
  #playerState;
  #mutex;
  #mapUtils;
  #isTileWalkable;
  #rotationTable;

  /**
   * @param {EnemyState} state
   * @param {GameState} gs
   */
  constructor(state, gs) {
    const {
      mutex,
      state: { player },
      mapUtils,
      isTileWalkableByEnemy,
    } = gs;

    this.#state = state;
    this.#playerState = player;
    this.#mutex = mutex;
    this.#mapUtils = mapUtils;
    this.#isTileWalkable = isTileWalkableByEnemy;

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
  moveTo = async dir => {
    const { look } = this.#state;

    // Rotate to orient towards target direction
    const rotations = this.#rotationTable[look][dir];
    for (const r of rotations) {
      await r();
    }
    await this.moveForward();
  };

  canSeePlayer = () => {
    const {
      position: { x: px, z: pz },
    } = this.#playerState;
    const {
      position: { x, z },
      sightRange,
    } = this.#state;

    // NO: Beyond sight range
    const dist = distance(x, z, px, pz);
    if (dist > sightRange) {
      return false;
    }

    const visibilityLine = line({ x, y: z }, { x: px, y: pz });
    for (const v of visibilityLine) {
      if (this.#mapUtils.isVisionBlocker(v.x, v.y)) {
        // NO: No line of sight; vision obscured
        return false;
      }

      // Is current tile the same position as the player?
      if (v.x === px && v.y === pz) {
        // YES: Has line of sight
        return true;
      }
    }

    // NO: Within sight range, but no line of sight
    return false;
  };

  moveTowardsPlayer = async () => {
    const { position: playerPos } = this.#playerState;
    const {
      position: { x, z },
    } = this.#state;

    const neighbors = this.#neighbors(x, z);

    const scores = neighbors.map(({ dir, offset: o }) => {
      const score = distance(x + o.x, z + o.z, playerPos.x, playerPos.z);
      return {
        dir,
        offset: o,
        score,
      };
    });

    const lowest = minBy(scores, o => o.score);

    await this.moveTo(lowest.dir);
  };

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
