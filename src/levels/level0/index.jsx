/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';

import loadLevel from '../../utils/level-loader';
import LevelMesh from '../../components/level-mesh';
import StageProps from '../../components/stage-props';

import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Player from '../../components/player';

import { InstancedModelsProvider } from '../../meshes/instanced';
import BasicEnemy2 from '../../models/compound/enemies/basic-enemy-2';
import BasicRobot from '../../models/compound/enemies/basic-robot';

import Crates from '../../models/stage-props/crates';

const instancedModelsConfig = {
  stageProps: {
    crates: 25,
  },
  enemies: {
    sampleEnemy2: 25,
    testRobot: 25,
  },
};

const entityModelLookup = {
  stageProps: {
    crates: Crates,
  },
  enemies: {
    basic_enemy: BasicEnemy2,
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

  // const playerPos = mapPosToPos(start.x, start.z);
  // const playerRotY = directionAngle[start.look];

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

      <InstancedModelsProvider config={instancedModelsConfig}>
        <ambientLight intensity={0.01} />
        {/* <ambientLight intensity={0.03} /> */}

        <Player
          ref={playerRef}
          // position={playerPos}
          // rotation={[0, playerRotY, 0]}
          utils={utils}
        />
        <LevelMesh atlas={atlas} geometry={geometry} />
        {/* <Enemies /> */}
        <StageProps
          data={entities.props}
          modelLookup={entityModelLookup.stageProps}
        />
      </InstancedModelsProvider>
    </>
  );
}

function Enemies() {
  return (
    <>
      <group position={[2.5, 0, 1.5]}>
        <group scale={[1, 1, 1]}>
          <group position={[0, 0.5, 0]}>
            <BasicEnemy2 />
          </group>
        </group>
      </group>

      <group position={[0, 0, 0]}>
        <BasicRobot />
      </group>
    </>
  );
}
