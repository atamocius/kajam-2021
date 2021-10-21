/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';

import loadLevel from '../../utils/level-loader';
import LevelMesh from '../../components/level-mesh';
import StageProps from '../../components/stage-props';

import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Player from '../../components/player';
import Enemies from '../../components/enemies';

import { InstancedModelsProvider } from '../../meshes/instanced';
import LevelDataProvider from '../../logic/level-data-provider';

const instancedModelsConfig = {
  stageProps: {
    crates: 25,
  },
  enemies: {
    sampleEnemy2: 25,
    testRobot: 25,
    bot: 25,
  },
};

export default function Level0() {
  /**
   * @type {React.MutableRefObject<PlayerApi>}
   */
  const playerRef = useRef();

  const level = loadLevel(
    '/levels/level0/data.json',
    '/levels/level0/geometry.json'
  );
  const { atlas, geometry, logic, utils } = level;
  const { start, goal, entities } = logic;

  useEffect(() => {
    // if (!playerRef) {
    //   return;
    // }
    playerRef.current.setMapPos(start.x, start.z);
    playerRef.current.setLook(start.look);
  }, []);

  /**
   * @param {KeyboardEvent} ev
   */
  const handleKeyDown = async ev => {
    switch (ev.code) {
      // WASD
      case 'KeyW':
        ev.preventDefault();
        await playerRef.current.moveForward();
        break;

      case 'KeyS':
        ev.preventDefault();
        await playerRef.current.moveBackward();
        break;

      case 'KeyA':
        ev.preventDefault();
        await playerRef.current.strafeLeft();
        break;

      case 'KeyD':
        ev.preventDefault();
        await playerRef.current.strafeRight();
        break;

      // Turn
      case 'KeyQ':
        ev.preventDefault();
        await playerRef.current.rotateLeft();
        break;

      case 'KeyE':
        ev.preventDefault();
        await playerRef.current.rotateRight();
        break;

      default:
        break;
    }
  };

  useKeyDownNoRepeat(handleKeyDown);

  return (
    <>
      {/* <color attach='background' args={['#a1eeee']} /> */}

      <LevelDataProvider levelData={level}>
        <InstancedModelsProvider config={instancedModelsConfig}>
          <ambientLight intensity={0.02} />

          <Player ref={playerRef} />
          <LevelMesh />
          <Enemies />
          <StageProps />
        </InstancedModelsProvider>
      </LevelDataProvider>
    </>
  );
}
