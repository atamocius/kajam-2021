import React, { createContext, useContext } from 'react';

import { useLevelData } from '../../utils/level-data-provider';

import GameState from './game-state';
import PlayerBehavior from './player-behavior';
import EnemyBehaviors from './enemy-behaviors';

/**
 * @typedef {Object} GameLogicApi
 * @property {PlayerBehavior} player
 * @property {EnemyBehaviors} enemies
 */

/** @type {React.Context<GameLogicApi>} */
const GameLogicContext = createContext();

export function GameLogicProvider({ children }) {
  const level = useLevelData();
  const gs = new GameState(level);

  const api = {
    player: new PlayerBehavior(gs),
    enemies: new EnemyBehaviors(gs),
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
