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

  const playerState = {
    view: null,
    position: {
      x: start.x,
      z: start.z,
    },
    look: start.look,
    isAnimating: false,
  };
  const enemyState = {};

  const register = view => {
    const {
      position: { x, z },
      look,
    } = playerState;
    playerState.view = view;
    playerState.view.setMapPos(x, z);
    playerState.view.setLook(look);
  };

  const unregister = () => {
    playerState.view = null;
  };

  const setPosition = (x, z) => {
    playerState.view.setMapPos(x, z);
    playerState.position.x = x;
    playerState.position.z = z;
  };

  const setLook = look => {
    playerState.view.setLook(look);
    playerState.look = look;
  };

  const isTileWalkable = (x, z) => {
    // TODO: Check enemy positions
    return utils.isWalkable(x, z);
  };

  const rotateLeft = async () => {
    if (playerState.isAnimating) return;
    playerState.isAnimating = true;

    const {
      position: { x, z },
      look,
      view,
    } = playerState;

    const fromLook = look;
    const toLook = rotationLeftLookup[look];

    // Update prior to animate
    playerState.look = toLook;

    // Animate
    await view.rotateLeft(x, z, fromLook);

    playerState.isAnimating = false;
  };

  const rotateRight = async () => {
    if (playerState.isAnimating) return;
    playerState.isAnimating = true;

    const {
      position: { x, z },
      look,
      view,
    } = playerState;

    const fromLook = look;
    const toLook = rotationRightLookup[look];

    // Update prior to animate
    playerState.look = toLook;

    // Animate
    await view.rotateRight(x, z, fromLook);

    playerState.isAnimating = false;
  };

  const moveForward = async () => {
    if (playerState.isAnimating) return;
    playerState.isAnimating = true;

    const { position, look, view } = playerState;

    const { x, z } = moveForwardOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkable(toX, toZ)) {
      playerState.isAnimating = false;
      return;
    }

    // Update prior to animate
    playerState.position.x = toX;
    playerState.position.z = toZ;

    // Animate
    await view.moveForward(fromX, fromZ, look);

    playerState.isAnimating = false;
  };

  const moveBackward = async () => {
    if (playerState.isAnimating) return;
    playerState.isAnimating = true;

    const { position, look, view } = playerState;

    const { x, z } = moveBackwardOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkable(toX, toZ)) {
      playerState.isAnimating = false;
      return;
    }

    // Update prior to animate
    playerState.position.x = toX;
    playerState.position.z = toZ;

    // Animate
    await view.moveBackward(fromX, fromZ, look);

    playerState.isAnimating = false;
  };

  const strafeLeft = async () => {
    if (playerState.isAnimating) return;
    playerState.isAnimating = true;

    const { position, look, view } = playerState;

    const { x, z } = strafeLeftOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkable(toX, toZ)) {
      playerState.isAnimating = false;
      return;
    }

    // Update prior to animate
    playerState.position.x = toX;
    playerState.position.z = toZ;

    // Animate
    await view.strafeLeft(fromX, fromZ, look);

    playerState.isAnimating = false;
  };

  const strafeRight = async () => {
    if (playerState.isAnimating) return;
    playerState.isAnimating = true;

    const { position, look, view } = playerState;

    const { x, z } = strafeRightOffsetLookup[look];

    const fromX = position.x;
    const fromZ = position.z;
    const toX = fromX + x;
    const toZ = fromZ + z;

    if (!isTileWalkable(toX, toZ)) {
      playerState.isAnimating = false;
      return;
    }

    // Update prior to animate
    playerState.position.x = toX;
    playerState.position.z = toZ;

    // Animate
    await view.strafeRight(fromX, fromZ, look);

    playerState.isAnimating = false;
  };

  const api = {
    player: {
      register,
      unregister,
      setPosition,
      setLook,
      isTileWalkable,
      rotateLeft,
      rotateRight,
      moveForward,
      moveBackward,
      strafeLeft,
      strafeRight,
    },
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
