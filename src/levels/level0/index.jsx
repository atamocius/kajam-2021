import { DEBUG_MODE } from '../../settings';

import React, { useEffect } from 'react';
import { Mutex } from 'async-mutex';

import loadLevel from '../../utils/level-loader';
import LevelMesh from '../../components/level-mesh';
import StageProps from '../../components/stage-props';
import Pickups from '../../components/pickups';

import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Player from '../../components/player';
import Enemies from '../../components/enemies';

import { InstancedModelsProvider } from '../../meshes/instanced';
import LevelDataProvider from '../../utils/level-data-provider';
import { GameLogicProvider, useGameLogic } from '../../logic/game-logic';
import {
  AudioManagerProvider,
  useAudioManager,
  BgmIndex,
} from '../../utils/audio-manager';

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
    pickups: {
      health: 25,
      ammo: 25,
    },
  };

  return (
    <LevelDataProvider levelData={level}>
      <AudioManagerProvider>
        <GameLogicProvider>
          <InstancedModelsProvider config={instancedModelsConfig}>
            <Content />
          </InstancedModelsProvider>
        </GameLogicProvider>
      </AudioManagerProvider>
    </LevelDataProvider>
  );
}

const mutex = new Mutex();

function Content() {
  const {
    addGameOverListener,
    isGameOver,
    addExitedLevelListener,
    hasExitedLevel,
    player,
  } = useGameLogic();

  useEffect(() => addGameOverListener(() => console.log('GAME OVER!!!')), []);

  useEffect(() => addExitedLevelListener(() => console.log('GOAL!!!')), []);

  const audioMgr = useAudioManager();

  useEffect(() => {
    audioMgr.playBgm(BgmIndex.level1Bgm);
  }, []);

  /**
   * @param {KeyboardEvent} ev
   */
  const handleKeyDown = async ev => {
    if (isGameOver() || hasExitedLevel()) {
      return;
    }

    await mutex.runExclusive(async () => {
      switch (ev.code) {
        case 'KeyM':
          ev.preventDefault();
          // await player.moveForward();
          // const e = enemies.get(0);
          // const c = e.canSeePlayer();
          // console.log('🔫', c);
          // e.findPathToPlayer();
          // enemies.moveTowardsPlayer();
          // debug.damageEnemy(0, 1);
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

        // Attack
        case 'Space':
          ev.preventDefault();
          await player.attack();
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
      <Pickups />
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
