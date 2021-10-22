/**
 * @typedef {import('zustand').UseStore<GameLogicApi>} UseStoreGameLogicApi
 */

import React, { createContext, useContext, useEffect } from 'react';
import create from 'zustand';
import produce from 'immer';

import { useLevelData } from '../../utils/level-data-provider';

import { Direction } from '../../utils/level-loader/common';

/** @type {React.Context<UseStoreGameLogicApi>} */
const GameLogicContext = createContext();

/**
 * @typedef {Object} GameLogicApi
 */

export function GameLogicProvider({ children }) {
  const { logic, utils } = useLevelData();
  const {
    start,
    goal,
    entities: { enemies },
  } = logic;

  /** @type {UseStoreGameLogicApi} */
  const api = create((set, get) => ({
    // Player State
    player: {
      position: {
        x: start.x,
        z: start.z,
      },
      look: start.look,
    },

    // Enemy State
    enemies: {},

    // Player Actions
    // initPlayer: () => {
    //   const { x, z, look } = start;
    //   const s = get();
    //   s.setPlayerPosition(x, z);
    //   s.setPlayerLook(look);
    // },
    setPlayerPosition: (x, z) =>
      set(
        produce(draft => {
          draft.player.position.x = x;
          draft.player.position.z = z;
        })
      ),
    setPlayerLook: look =>
      set(produce(draft => void (draft.player.look = look))),
    isTileWalkableByPlayer: (x, z) => {
      // TODO: Check enemy positions
      return utils.isWalkable(x, z);
    },
  }));

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
