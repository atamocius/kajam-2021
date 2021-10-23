import React, { createContext, useContext } from 'react';

import { useLevelData } from '../../utils/level-data-provider';

import GameState from './game-state';
import PlayerBehavior from './player-behavior';
import EnemyBehaviors from './enemy-behaviors';
import PickupBehaviors from './pickup-behavior';

/**
 * @typedef {Object} GameLogicApi
 * @property {() => boolean} isGameOver
 * @property {PlayerBehavior} player
 * @property {EnemyBehaviors} enemies
 * @property {PickupBehaviors} pickups
 */

/** @type {React.Context<GameLogicApi>} */
const GameLogicContext = createContext();

export function GameLogicProvider({ children }) {
  const level = useLevelData();
  const gs = new GameState(level);

  const api = {
    isGameOver: gs.isGameOver,
    addGameOverListener: gs.addGameOverListener,
    player: new PlayerBehavior(gs),
    enemies: new EnemyBehaviors(gs),
    pickups: new PickupBehaviors(gs),
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
