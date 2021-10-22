/**
 * @typedef {import('../../components/player').PlayerApi} PlayerApi
 * @typedef {import('../../components/enemies/enemy').EnemyApi} EnemyApi
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./index').PlayerState} PlayerState
 * @typedef {import('./index').EnemyState} EnemyState
 */

import React, { createContext, useContext } from 'react';

import { useLevelData } from '../../utils/level-data-provider';
import { Direction } from '../../utils/level-loader/common';
import PlayerBehavior from './player-behavior';
import EnemyBehaviors from './enemy-behaviors';
import { default as createPlayerState } from './player-state';
import { default as createEnemyStates } from './enemy-states';

/**
 * @typedef {Object} GameLogicApi
 * @property {PlayerBehavior} player
 * @property {EnemyBehaviors} enemies
 */

/** @type {React.Context<GameLogicApi>} */
const GameLogicContext = createContext();

export function GameLogicProvider({ children }) {
  const { logic, utils } = useLevelData();
  const {
    start,
    goal,
    entities: { enemies },
  } = logic;

  const [playerState, playerStateHelpers] = createPlayerState(
    start.x,
    start.z,
    start.look
  );

  const [enemyStates, enemyStatesHelpers] = createEnemyStates(enemies);

  const api = {
    player: new PlayerBehavior(
      playerState,
      playerStateHelpers,
      enemyStates,
      enemyStatesHelpers,
      utils
    ),
    enemies: new EnemyBehaviors(
      enemyStates,
      enemyStatesHelpers,
      playerState,
      playerStateHelpers,
      utils
    ),
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
