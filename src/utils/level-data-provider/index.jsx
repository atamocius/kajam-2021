/**
 * @typedef {import('../level-loader/types').LoadedLevelData} LoadedLevelData
 */

import React, { createContext, useContext } from 'react';

/** @type {React.Context<LoadedLevelData>} */
const LevelDataContext = createContext();

/**
 * @param {{ levelData: LoadedLevelData }} param0
 */
export default function LevelDataProvider({ levelData, children }) {
  return (
    <LevelDataContext.Provider value={levelData}>
      {children}
    </LevelDataContext.Provider>
  );
}

export function useLevelData() {
  const ctx = useContext(LevelDataContext);

  if (ctx === undefined) {
    throw new Error('useLevelData must be used within a LevelDataProvider');
  }

  return ctx;
}
