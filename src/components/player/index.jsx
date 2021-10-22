/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 */

import React, { useRef, forwardRef, useEffect } from 'react';

import { useGameLogic } from '../../logic/game-logic';

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

    const gameLogic = useGameLogic();

    useEffect(() => {
      if (!fwdRef) return;
      fwdRef.current = makeApi(ref, gameLogic);
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
 * @property {() => void} init
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
 * @param {*} gl
 * @return {PlayerApi}
 */
function makeApi(ref, gl) {
  const pac = new PlayerAnimationController(ref);

  let isAnimRunning = false;

  const init = () => {
    const {
      player: {
        position: { x, z },
        look,
      },
    } = gl.getState();

    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);

    const ry = directionAngle[look];
    ref.current.rotation.set(0, ry, 0);
  };

  const setMapPos = (x, z) => {
    gl.getState().setPlayerPosition(x, z);

    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);
  };

  const setLook = look => {
    gl.getState().setPlayerLook(look);

    const ry = directionAngle[look];
    ref.current.rotation.set(0, ry, 0);
  };

  const rotateLeft = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const {
      player: { position, look },
      setPlayerLook,
    } = gl.getState();

    const fromLook = look;
    const toLook = rotationLeftLookup[look];

    // Update prior to animate
    setPlayerLook(toLook);

    // Animate
    pac.reset(position.x, position.z, fromLook);
    await pac.rotateLeft();

    isAnimRunning = false;
  };

  const rotateRight = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const {
      player: { position, look },
      setPlayerLook,
    } = gl.getState();

    const fromLook = look;
    const toLook = rotationRightLookup[look];

    // Update prior to animate
    setPlayerLook(toLook);

    // Animate
    pac.reset(position.x, position.z, fromLook);
    await pac.rotateRight();

    isAnimRunning = false;
  };

  const moveForward = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const {
      player: { position, look },
      setPlayerPosition,
      isTileWalkableByPlayer,
    } = gl.getState();

    const { x, z } = moveForwardOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkableByPlayer(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    setPlayerPosition(toX, toZ);

    // Animate
    pac.reset(fromX, fromZ, look);
    await pac.moveForward();

    isAnimRunning = false;
  };

  const moveBackward = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const {
      player: { position, look },
      setPlayerPosition,
      isTileWalkableByPlayer,
    } = gl.getState();

    const { x, z } = moveBackwardOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkableByPlayer(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    setPlayerPosition(toX, toZ);

    // Animate
    pac.reset(fromX, fromZ, look);
    await pac.moveBackward();

    isAnimRunning = false;
  };

  const strafeLeft = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const {
      player: { position, look },
      setPlayerPosition,
      isTileWalkableByPlayer,
    } = gl.getState();

    const { x, z } = strafeLeftOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkableByPlayer(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    setPlayerPosition(toX, toZ);

    // Animate
    pac.reset(fromX, fromZ, look);
    await pac.strafeLeft();

    isAnimRunning = false;
  };

  const strafeRight = async () => {
    if (isAnimRunning) return;

    isAnimRunning = true;

    const {
      player: { position, look },
      setPlayerPosition,
      isTileWalkableByPlayer,
    } = gl.getState();

    const { x, z } = strafeRightOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkableByPlayer(toX, toZ)) {
      isAnimRunning = false;
      return;
    }

    // Update prior to animate
    setPlayerPosition(toX, toZ);

    // Animate
    pac.reset(fromX, fromZ, look);
    await pac.strafeRight();

    isAnimRunning = false;
  };

  return {
    init,

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
