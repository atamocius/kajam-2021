/**
 * @typedef {import('zustand').UseStore<GameLogicApi>} UseStoreGameLogicApi
 */

import React, { createContext, useContext, useEffect } from 'react';
import create from 'zustand';

import { useLevelData } from '../../utils/level-data-provider';

/** @type {React.Context<UseStoreGameLogicApi>} */
const GameLogicContext = createContext();

/**
 * @typedef {Object} GameLogicApi
 */

export function GameLogicProvider({ children }) {
  const { logic, utils } = useLevelData();

  const value = {};

  return (
    <GameLogicContext.Provider value={value}>
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
