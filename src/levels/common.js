/**
 * @typedef {import('../utils/level-loader/types').MapCoords} MapCoords
 */

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

export const neighborOffsetLookup = {
  [Direction.north]: { x: 0, z: -1 },
  [Direction.south]: { x: 0, z: 1 },
  [Direction.west]: { x: -1, z: 0 },
  [Direction.east]: { x: 1, z: 0 },
};

export const moveForwardOffsetLookup = {
  [Direction.north]: { x: 0, z: -1 },
  [Direction.south]: { x: 0, z: 1 },
  [Direction.west]: { x: -1, z: 0 },
  [Direction.east]: { x: 1, z: 0 },
};

export const moveBackwardOffsetLookup = {
  [Direction.north]: { x: 0, z: 1 },
  [Direction.south]: { x: 0, z: -1 },
  [Direction.west]: { x: 1, z: 0 },
  [Direction.east]: { x: -1, z: 0 },
};

export const strafeLeftOffsetLookup = {
  [Direction.north]: { x: -1, z: 0 },
  [Direction.south]: { x: 1, z: 0 },
  [Direction.west]: { x: 0, z: 1 },
  [Direction.east]: { x: 0, z: -1 },
};

export const strafeRightOffsetLookup = {
  [Direction.north]: { x: 1, z: 0 },
  [Direction.south]: { x: -1, z: 0 },
  [Direction.west]: { x: 0, z: -1 },
  [Direction.east]: { x: 0, z: 1 },
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

export const healthClassLookup = {
  [0]: 3,
  [1]: 6,
  [2]: 10,
};

export const PickupKind = {
  health: 'health',
  ammo: 'ammo',
};

export const pickupDataLookup = {
  [PickupKind.health]: {
    value: 10,
  },
  [PickupKind.ammo]: {
    value: 7,
  },
};
