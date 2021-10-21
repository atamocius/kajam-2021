/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 */

import React, { useRef, forwardRef, useEffect } from 'react';

import { useLevelData } from '../../logic/level-data-provider';

import Camera from './camera';
import Flashlight from './flashlight';
import {
  mapXToPosX,
  mapZToPosZ,
  directionAngle,
  rotationRightLookup,
  rotationLeftLookup,
  moveForwardOffsetLookup,
  moveBackwardOffsetLookup,
  strafeRightOffsetLookup,
  strafeLeftOffsetLookup,
} from '../../levels/common';
import { Direction } from '../../utils/level-loader/common';

import PlayerAnimationController from './animation-controller';

const Player = forwardRef(
  /**
   * @param {React.ForwardedRef<PlayerApi>} fwdRef
   */
  (_, fwdRef) => {
    /**
     * @type {React.MutableRefObject<GroupProps>}
     */
    const ref = useRef();

    const { utils } = useLevelData();

    useEffect(() => {
      if (!fwdRef) return;
      fwdRef.current = makeApi(ref, utils);
      return () => (fwdRef.current = null);
    }, []);

    return (
      <group ref={ref}>
        <Flashlight position={[0, 0.5, 0]} />
        <Camera position={[0, 0.5, 0]} />
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
 * @property {() => Promise<void>} strafeLeft
 * @property {() => Promise<void>} strafeRight
 */

/**
 * @param {React.MutableRefObject<GroupProps>} ref
 * @param {MapUtilFuncs} utils
 * @return {PlayerApi}
 */
function makeApi(ref, utils) {
  const pac = new PlayerAnimationController(ref);
  const { isWalkable } = utils;

  // TODO: Pass from context
  const data = {
    position: {
      x: 0,
      z: 0,
    },
    look: Direction.south,
  };

  let isAnimRunning = false;

  const setMapPos = (x, z) => {
    data.position.x = x;
    data.position.z = z;

    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);
  };

  const setLook = look => {
    data.look = look;

    const ry = directionAngle[look];
    ref.current.rotation.set(0, ry, 0);
  };

  const rotateLeft = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const fromLook = data.look;
    const toLook = rotationLeftLookup[data.look];

    // Update prior to animate
    data.look = toLook;

    // Animate
    pac.reset(data.position.x, data.position.z, fromLook);
    await pac.rotateLeft();

    isAnimRunning = false;
  };

  const rotateRight = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const fromLook = data.look;
    const toLook = rotationRightLookup[data.look];

    // Update prior to animate
    data.look = toLook;

    // Animate
    pac.reset(data.position.x, data.position.z, fromLook);
    await pac.rotateRight();

    isAnimRunning = false;
  };

  // TODO: Add map bounds, map props, and enemy pos validation
  const moveForward = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const { x, z } = moveForwardOffsetLookup[data.look];

    const fromX = data.position.x;
    const fromZ = data.position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isWalkable(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    data.position.x = toX;
    data.position.z = toZ;

    // Animate
    pac.reset(fromX, fromZ, data.look);
    await pac.moveForward();

    isAnimRunning = false;
  };

  const moveBackward = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const { x, z } = moveBackwardOffsetLookup[data.look];

    const fromX = data.position.x;
    const fromZ = data.position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isWalkable(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    data.position.x = toX;
    data.position.z = toZ;

    // Animate
    pac.reset(fromX, fromZ, data.look);
    await pac.moveBackward();

    isAnimRunning = false;
  };

  const strafeLeft = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const { x, z } = strafeLeftOffsetLookup[data.look];

    const fromX = data.position.x;
    const fromZ = data.position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isWalkable(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    data.position.x = toX;
    data.position.z = toZ;

    // Animate
    pac.reset(fromX, fromZ, data.look);
    await pac.strafeLeft();

    isAnimRunning = false;
  };

  const strafeRight = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const { x, z } = strafeRightOffsetLookup[data.look];

    const fromX = data.position.x;
    const fromZ = data.position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isWalkable(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    data.position.x = toX;
    data.position.z = toZ;

    // Animate
    pac.reset(fromX, fromZ, data.look);
    await pac.strafeRight();

    isAnimRunning = false;
  };

  return {
    setMapPos,
    setLook,

    rotateRight,
    rotateLeft,

    moveForward,
    moveBackward,
    strafeLeft,
    strafeRight,
  };
}
