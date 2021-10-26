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

export default function Level1({ onGameOver, onExitedLevel }) {
  const level = loadLevel(
    '/levels/level1/data.json',
    '/levels/level1/geometry.json'
  );

  const instancedModelsConfig = {
    stageProps: {
      crates: 50,
    },
    enemies: {
      bot: 50,
      alienBody: 50,
      alienLegs: 50,
    },
    pickups: {
      health: 50,
      ammo: 50,
    },
  };

  return (
    <LevelDataProvider levelData={level}>
      <AudioManagerProvider>
        <GameLogicProvider>
          <InstancedModelsProvider config={instancedModelsConfig}>
            <Content onGameOver={onGameOver} onExitedLevel={onExitedLevel} />
          </InstancedModelsProvider>
        </GameLogicProvider>
      </AudioManagerProvider>
    </LevelDataProvider>
  );
}

const mutex = new Mutex();

function Content({ onGameOver, onExitedLevel }) {
  const {
    addGameOverListener,
    isGameOver,
    addExitedLevelListener,
    hasExitedLevel,
    player,
  } = useGameLogic();

  const audioMgr = useAudioManager();

  useEffect(() => {
    addGameOverListener(() => {
      audioMgr.stopBgm(BgmIndex.level2Bgm);
      onGameOver();
    });
    addExitedLevelListener(() => {
      audioMgr.stopBgm(BgmIndex.level2Bgm);
      onExitedLevel();
    });

    audioMgr.playBgm(BgmIndex.level2Bgm);
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
