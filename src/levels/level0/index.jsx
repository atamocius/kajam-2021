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
import { GameLogicProvider, useGameLogic } from '../../logic/game-logic';

import { Mutex } from 'async-mutex';

export default function Level0() {
  const level = loadLevel(
    '/levels/level0/data.json',
    '/levels/level0/geometry.json'
  );

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

  return (
    <LevelDataProvider levelData={level}>
      <GameLogicProvider>
        <InstancedModelsProvider config={instancedModelsConfig}>
          <Content />
        </InstancedModelsProvider>
      </GameLogicProvider>
    </LevelDataProvider>
  );
}

const mutex = new Mutex();

function Content() {
  const { player, enemies } = useGameLogic();

  /**
   * @param {KeyboardEvent} ev
   */
  const handleKeyDown = async ev => {
    await mutex.runExclusive(async () => {
      switch (ev.code) {
        case 'KeyM':
          ev.preventDefault();
          // await player.moveForward();
          const e = enemies.get(0);
          const c = e.canSeePlayer();
          console.log('🔫', c);
          // e.findPathToPlayer();
          await e.moveTowardsPlayer();
          break;

        // WASD
        case 'KeyW':
          ev.preventDefault();
          await player.moveForward();
          break;

        case 'KeyS':
          ev.preventDefault();
          await player.moveBackward();
          break;

        case 'KeyA':
          ev.preventDefault();
          await player.strafeLeft();
          break;

        case 'KeyD':
          ev.preventDefault();
          await player.strafeRight();
          break;

        // Turn
        case 'KeyQ':
          ev.preventDefault();
          await player.rotateLeft();
          break;

        case 'KeyE':
          ev.preventDefault();
          await player.rotateRight();
          break;

        default:
          break;
      }
    });
  };

  useKeyDownNoRepeat(handleKeyDown);

  return (
    <>
      <Lighting />
      <Player />
      <LevelMesh />
      <Enemies />
      <StageProps />
    </>
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
