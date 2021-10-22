/**
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
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

/**
 * @param {EnemyState} enemyState
 * @param {PlayerState} playerState
 * @param {MapUtilFuncs} mapUtils
 */
export default function createEnemyBehaviors(
  enemyState,
  playerState,
  mapUtils
) {
  return {};
}
