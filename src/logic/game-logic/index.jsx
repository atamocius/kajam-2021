import React, { createContext, useContext } from 'react';

import { useLevelData } from '../../utils/level-data-provider';

import { Direction } from '../../utils/level-loader/common';
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

import createPlayerBehaviors from './player-behavior';

/** @type {React.Context<any>} */
const GameLogicContext = createContext();

/**
 * @typedef {Object} PlayerState
 * @property {PlayerApi} view
 * @property {MapCoords} position
 * @property {Direction} look
 * @property {boolean} isAnimating
 */

/**
 * @typedef {Object} EnemyState
 */

export function GameLogicProvider({ children }) {
  const { logic, utils } = useLevelData();
  const {
    start,
    goal,
    entities: { enemies },
  } = logic;

  /** @type {PlayerState} */
  const playerState = {
    view: null,
    position: {
      x: start.x,
      z: start.z,
    },
    look: start.look,
    isAnimating: false,
  };
  /** @type {EnemyState} */
  const enemyState = {};

  const api = {
    player: createPlayerBehaviors(playerState, enemyState, utils),
  };

  return (
    <GameLogicContext.Provider value={api}>
      {children}
    </GameLogicContext.Provider>
  );
}

export function useGameLogic() {
  const ctx = useContext(GameLogicContext);

  if (ctx === undefined) {
    throw new Error('useGameLogic must be used within a GameLogicProvider');
  }

  return ctx;
}
