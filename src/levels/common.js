/**
 * @typedef {import('../utils/level-loader/types').MapCoords} MapCoords
 */

import { Quaternion, Vector3 } from 'three';

import { Direction } from '../utils/level-loader/common';

export const directionAngle = {
  [Direction.north]: Math.PI,
  [Direction.south]: 0,
  [Direction.west]: Math.PI + Math.PI / 2,
  [Direction.east]: Math.PI / 2,
};

export const rotationRightLookup = {
  [Direction.north]: Direction.east,
  [Direction.south]: Direction.west,
  [Direction.west]: Direction.north,
  [Direction.east]: Direction.south,
};

export const rotationLeftLookup = {
  [Direction.north]: Direction.west,
  [Direction.south]: Direction.east,
  [Direction.west]: Direction.south,
  [Direction.east]: Direction.north,
};

const UP_AXIS = new Vector3(0, 1, 0);

export const directionQuats = {
  [Direction.north]: new Quaternion().setFromAxisAngle(UP_AXIS, Math.PI),
  [Direction.south]: new Quaternion().setFromAxisAngle(UP_AXIS, 0),
  [Direction.west]: new Quaternion().setFromAxisAngle(
    UP_AXIS,
    Math.PI + Math.PI / 2
  ),
  [Direction.east]: new Quaternion().setFromAxisAngle(UP_AXIS, Math.PI / 2),
};

/**
 * @param {number} x
 * @param {number} z
 */
export function mapPosToPos(x, z) {
  return [Math.floor(x) + 0.5, 0, Math.floor(z) + 0.5];
}

/**
 * @param {number} x
 */
export function mapXToPosX(x) {
  return Math.floor(x) + 0.5;
}

/**
 * @param {number} z
 */
export function mapZToPosZ(z) {
  return Math.floor(z) + 0.5;
}
