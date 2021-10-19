/**
 * @typedef {import('three').Vector3} Vector3
 * @typedef {import('three').Euler} Euler
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 */

import React, { useRef, useMemo, forwardRef, useEffect } from 'react';

import Flashlight from './flashlight';
import {
  mapXToPosX,
  mapZToPosZ,
  directionQuats,
  rotationRightLookup,
  rotationLeftLookup,
  moveForwardOffsetLookup,
  moveBackwardOffsetLookup,
  strafeRightOffsetLookup,
  strafeLeftOffsetLookup,
} from '../../levels/common';
import { Direction } from '../../utils/level-loader/common';

/**
 * @typedef {Object} PlayerProps
 * @property {Vector3} position
 * @property {Euler} rotation
 */

const Player = forwardRef(
  /**
   * @param {PlayerProps} param0
   * @param {React.ForwardedRef<PlayerApi>} fwdRef
   */
  ({ position, rotation }, fwdRef) => {
    /**
     * @type {React.Ref<GroupProps>}
     */
    const ref = useRef();

    useEffect(() => {
      if (!fwdRef) return;
      fwdRef.current = makeApi(ref);
      return () => (fwdRef.current = null);
    }, []);

    return (
      <group ref={ref} position={position} rotation={rotation}>
        <Flashlight position={[0, 0.5, 0]} />
      </group>
    );
  }
);

export default Player;

/**
 * @typedef {Object} PlayerApi
 * @property {(x: number, z: number) => void} setMapPos
 * @property {(look: Direction) => void} setLook
 * @property {() => Promise<void>} rotateRight
 * @property {() => Promise<void>} rotateLeft
 * @property {() => Promise<void>} moveForward
 * @property {() => Promise<void>} moveBackward
 * @property {() => Promise<void>} strafeRight
 * @property {() => Promise<void>} strafeLeft
 */

/**
 * @param {React.Ref<GroupProps>} ref
 * @return {PlayerApi}
 */
function makeApi(ref) {
  // TODO: Pass from context
  const data = {
    position: {
      x: 0,
      z: 0,
    },
    look: Direction.south,
  };

  const setMapPos = (x, z) => {
    data.position.x = x;
    data.position.z = z;

    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);
  };

  const setLook = look => {
    data.look = look;

    const q = directionQuats[look];
    ref.current.setRotationFromQuaternion(q);
  };

  const rotateRight = async () => {
    data.look = rotationRightLookup[data.look];

    const q = directionQuats[data.look];
    ref.current.setRotationFromQuaternion(q);
  };
  const rotateLeft = async () => {
    data.look = rotationLeftLookup[data.look];

    const q = directionQuats[data.look];
    ref.current.setRotationFromQuaternion(q);
  };

  // TODO: Add map bounds, map props, and enemy pos validation
  const moveForward = async () => {
    const { x, z } = moveForwardOffsetLookup[data.look];
    setMapPos(data.position.x + x, data.position.z + z);
  };
  const moveBackward = async () => {
    const { x, z } = moveBackwardOffsetLookup[data.look];
    setMapPos(data.position.x + x, data.position.z + z);
  };
  const strafeRight = async () => {
    const { x, z } = strafeRightOffsetLookup[data.look];
    setMapPos(data.position.x + x, data.position.z + z);
  };
  const strafeLeft = async () => {
    const { x, z } = strafeLeftOffsetLookup[data.look];
    setMapPos(data.position.x + x, data.position.z + z);
  };

  return {
    setMapPos,
    setLook,

    rotateRight,
    rotateLeft,

    moveForward,
    moveBackward,
    strafeRight,
    strafeLeft,
  };
}
