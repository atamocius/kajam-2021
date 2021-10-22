/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 */

import { DEBUG_MODE } from '../../settings';

import React, { useRef, useMemo, useState, useEffect } from 'react';

import loadLevel from '../../utils/level-loader';
import LevelMesh from '../../components/level-mesh';
import StageProps from '../../components/stage-props';

import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Player from '../../components/player';
import Enemies from '../../components/enemies';

import { InstancedModelsProvider } from '../../meshes/instanced';
import LevelDataProvider from '../../utils/level-data-provider';
import { GameLogicProvider } from '../../logic/game-logic';

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

  useEffect(() => {
    if (!playerRef) return;
    playerRef.current.init();
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
    <LevelDataProvider levelData={level}>
      <GameLogicProvider>
        <InstancedModelsProvider config={instancedModelsConfig}>
          <Lighting />
          <Player ref={playerRef} />
          <LevelMesh />
          <Enemies />
          <StageProps />
        </InstancedModelsProvider>
      </GameLogicProvider>
    </LevelDataProvider>
  );
}

function Lighting() {
  if (DEBUG_MODE) {
    return null;
  }

  return (
    <>
      <ambientLight intensity={0.03} />
      <fog attach='fog' color={0x000000} near={8} far={15} />
    </>
  );
}
