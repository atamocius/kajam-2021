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
 * @property {(mx: number, mz: number) => void} setMapPos
 * @property {(look: Direction) => void} setLook
 * @property {() => Promise<void>} rotateRight
 * @property {() => Promise<void>} rotateLeft
 */

/**
 * @param {React.Ref<GroupProps>} ref
 * @return {PlayerApi}
 */
function makeApi(ref) {
  // TODO: Pass from context
  const data = {
    look: Direction.south,
  };

  const setMapPos = (mx, mz) => {
    const x = mapXToPosX(mx);
    const z = mapZToPosZ(mz);
    ref.current.position.set(x, 0, z);
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

  return {
    setMapPos,
    setLook,

    rotateRight,
    rotateLeft,
  };
}
