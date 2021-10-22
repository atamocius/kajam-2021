/**
 * @typedef {import('three').Object3D} Object3D
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 */

import React, { useRef, useEffect } from 'react';

import { useGameLogic } from '../../logic/game-logic';

import Camera from './camera';
import Flashlight from './flashlight';
import { mapXToPosX, mapZToPosZ, directionAngle } from '../../levels/common';
import { Direction } from '../../utils/level-loader/common';

import PlayerAnimationController from './animation-controller';

export default function Player() {
  /**
   * @type {React.MutableRefObject<GroupProps>}
   */
  const ref = useRef();

  const { player } = useGameLogic();

  useEffect(() => {
    const api = makeApi(ref);
    player.register(api);
    return () => player.unregister();
  }, []);

  return (
    <group ref={ref}>
      <Flashlight position={[0, 0.5, 0]} />
      <Camera position={[0, 0.5, 0]} />
    </group>
  );
}

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
 * @param {React.MutableRefObject<Object3D>} ref
 * @return {PlayerApi}
 */
function makeApi(ref) {
  const pac = new PlayerAnimationController(ref);

  const setMapPos = (x, z) => {
    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);
  };

  const setLook = look => {
    const ry = directionAngle[look];
    ref.current.rotation.set(0, ry, 0);
  };

  const rotateLeft = async (x, z, fromLook) => {
    pac.reset(x, z, fromLook);
    await pac.rotateLeft();
  };

  const rotateRight = async (x, z, fromLook) => {
    pac.reset(x, z, fromLook);
    await pac.rotateRight();
  };

  const moveForward = async (fromX, fromZ, look) => {
    pac.reset(fromX, fromZ, look);
    await pac.moveForward();
  };

  const moveBackward = async (fromX, fromZ, look) => {
    pac.reset(fromX, fromZ, look);
    await pac.moveBackward();
  };

  const strafeLeft = async (fromX, fromZ, look) => {
    pac.reset(fromX, fromZ, look);
    await pac.strafeLeft();
  };

  const strafeRight = async (fromX, fromZ, look) => {
    pac.reset(fromX, fromZ, look);
    await pac.strafeRight();
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
