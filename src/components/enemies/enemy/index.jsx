/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 */

import React, { useRef, useEffect } from 'react';

import { useGameLogic } from '../../../logic/game-logic';

import { mapXToPosX, mapZToPosZ, directionAngle } from '../../../levels/common';
import { Direction } from '../../../utils/level-loader/common';

import AnimationController from './animation-controller';

export default function Enemy({ index, children }) {
  /**
   * @type {React.MutableRefObject<GroupProps>}
   */
  const ref = useRef();

  const { enemies } = useGameLogic();

  useEffect(() => {
    const api = makeApi(ref);
    return enemies.get(index).register(api);
  }, []);

  return <group ref={ref}>{children}</group>;
}

/**
 * @typedef {Object} EnemyApi
 * @property {(x: number, z: number) => void} setMapPos
 * @property {(look: Direction) => void} setLook
 * @property {(isVisible: boolean) => void} setVisibility
 * @property {(x: number, z: number, fromLook: number) => Promise<void>} rotateLeft
 * @property {(x: number, z: number, fromLook: number) => Promise<void>} rotateRight
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} moveForward
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} moveBackward
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} strafeLeft
 * @property {(fromX: number, fromZ: number, look: number) => Promise<void>} strafeRight
 * @property {(x: number, z: number, look: number) => Promise<void>} attack
 * @property {(x: number, z: number, look: number) => Promise<void>} damage
 * @property {(x: number, z: number, look: number) => Promise<void>} death
 */

/**
 * @param {React.MutableRefObject<GroupProps>} ref
 * @return {EnemyApi}
 */
function makeApi(ref) {
  const pac = new AnimationController(ref);

  const setMapPos = (x, z) => {
    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);
  };

  const setLook = look => {
    const ry = directionAngle[look];
    ref.current.rotation.set(0, ry, 0);
  };

  const setVisibility = isVisible => {
    if (isVisible) {
      ref.current.position.setY(0);
    } else {
      ref.current.position.setY(-100);
    }
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

  const attack = async (x, z, look) => {
    pac.reset(x, z, look);
    await pac.attack();
  };

  const damage = async (x, z, look) => {
    pac.reset(x, z, look);
    await pac.damage();
  };

  const death = async (x, z, look) => {
    pac.reset(x, z, look);
    await pac.death();
  };

  return {
    setMapPos,
    setLook,
    setVisibility,

    rotateRight,
    rotateLeft,

    moveForward,
    moveBackward,
    strafeLeft,
    strafeRight,

    attack,
    damage,
    death,
  };
}
