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

  const setVisibility = isVisible => {
    if (isVisible) {
      ref.current.position.setY(0);
    } else {
      ref.current.position.setY(-100);
    }
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

  const attack = async (x, z, look) => {
    ac.reset(x, z, look);
    await ac.attack();
  };

  const damage = async (x, z, look) => {
    ac.reset(x, z, look);
    await ac.damage();
  };

  const death = async (x, z, look) => {
    ac.reset(x, z, look);
    await ac.death();
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
