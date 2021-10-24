/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./muzzle-flash').MuzzleFlashApi} MuzzleFlashApi
 * @typedef {import('../damage-indicator').DamageIndicatorApi} DamageIndicatorApi
 */

import React, { useRef, useEffect } from 'react';

import { useGameLogic } from '../../logic/game-logic';

import Camera from './camera';
import Flashlight from './flashlight';
import MuzzleFlash from './muzzle-flash';

import { mapXToPosX, mapZToPosZ, directionAngle } from '../../levels/common';
import { Direction } from '../../utils/level-loader/common';

import AnimationController from './animation-controller';
import DamageIndicator from '../damage-indicator';

export default function Player() {
  /**
   * @type {React.MutableRefObject<GroupProps>}
   */
  const ref = useRef();
  /**
   * @type {React.MutableRefObject<MuzzleFlashApi>}
   */
  const muzzleFlashRef = useRef();
  /**
   * @type {React.MutableRefObject<DamageIndicatorApi>}
   */
  const dmgIndRef = useRef();

  const { player } = useGameLogic();

  useEffect(() => {
    const api = makeApi(ref, muzzleFlashRef, dmgIndRef);
    return player.register(api);
  }, []);

  return (
    <group ref={ref}>
      <Flashlight position={[0, 0.5, 0]} />
      <MuzzleFlash ref={muzzleFlashRef} position={[0, 0.5, 0]} />
      <Camera position={[0, 0.5, 0]} />
      <DamageIndicator
        ref={dmgIndRef}
        position={[0, 0.5, 1]}
        scale={5}
        color={0xe03940}
      />
    </group>
  );
}

/**
 * @typedef {Object} PlayerApi
 * @property {(x: number, z: number) => void} setMapPos
 * @property {(look: Direction) => void} setLook
 * @property {(x: number, z: number, fromLook: number) => Promise<void>} rotateRight
 * @property {(x: number, z: number, fromLook: number) => Promise<void>} rotateLeft
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} moveForward
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} moveBackward
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} strafeLeft
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} strafeRight
 * @property {() => Promise<void>} flashMuzzle
 * @property {() => Promise<void>} indicateDamage
 */

/**
 * @param {React.MutableRefObject<GroupProps>} ref
 * @param {React.MutableRefObject<MuzzleFlashApi>} muzzleFlashRef
 * @param {React.MutableRefObject<DamageIndicatorApi>} dmgIndRef
 * @return {PlayerApi}
 */
function makeApi(ref, muzzleFlashRef, dmgIndRef) {
  const ac = new AnimationController(ref);

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
    ac.reset(x, z, fromLook);
    await ac.rotateLeft();
  };

  const rotateRight = async (x, z, fromLook) => {
    ac.reset(x, z, fromLook);
    await ac.rotateRight();
  };

  const moveForward = async (fromX, fromZ, look) => {
    ac.reset(fromX, fromZ, look);
    await ac.moveForward();
  };

  const moveBackward = async (fromX, fromZ, look) => {
    ac.reset(fromX, fromZ, look);
    await ac.moveBackward();
  };

  const strafeLeft = async (fromX, fromZ, look) => {
    ac.reset(fromX, fromZ, look);
    await ac.strafeLeft();
  };

  const strafeRight = async (fromX, fromZ, look) => {
    ac.reset(fromX, fromZ, look);
    await ac.strafeRight();
  };

  const flashMuzzle = async () => {
    await muzzleFlashRef.current.flash();
  };

  const indicateDamage = async () => {
    await dmgIndRef.current.flash();
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

    flashMuzzle,
    indicateDamage,
  };
}
