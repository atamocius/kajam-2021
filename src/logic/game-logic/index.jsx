import React, { createContext, useContext } from 'react';

import { useLevelData } from '../../utils/level-data-provider';

import GameState from './game-state';
import PlayerBehavior from './player-behavior';
import EnemyBehaviors from './enemy-behaviors';
import PickupBehaviors from './pickup-behavior';
import { useAudioManager } from '../../utils/audio-manager';

/**
 * @typedef {Object} GameLogicApi
 * @property {() => boolean} isGameOver
 * @property {() => boolean} hasExitedLevel
 * @property {(listener: () => void) => () => void} addGameOverListener
 * @property {(listener: () => void) => () => void} addKeyAcquiredListener
 * @property {(listener: () => void) => () => void} addExitedLevelListener
 * @property {PlayerBehavior} player
 * @property {EnemyBehaviors} enemies
 * @property {PickupBehaviors} pickups
 */

/** @type {React.Context<GameLogicApi>} */
const GameLogicContext = createContext();

export function GameLogicProvider({ children }) {
  const level = useLevelData();
  const am = useAudioManager();

  const gs = new GameState(level, am);
  const enemyBehaviors = new EnemyBehaviors(gs, am);
  const enemyAudioApis = enemyBehaviors.getAllAudioApis();
  gs.registerEnemyAudioApis(enemyAudioApis);

  const api = {
    isGameOver: gs.isGameOver,
    hasExitedLevel: gs.hasExitedLevel,
    addGameOverListener: gs.addGameOverListener,
    addKeyAcquiredListener: gs.addKeyAcquiredListener,
    addExitedLevelListener: gs.addExitedLevelListener,
    player: new PlayerBehavior(gs, am),
    enemies: enemyBehaviors,
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
