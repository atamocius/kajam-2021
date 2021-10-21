/**
 * @typedef {import('../../utils/level-loader/types').EnemyEntity} EnemyEntity
 */

import React, { createContext, useContext, useEffect } from 'react';

import { useLevelData } from '../../logic/level-data-provider';
import registry from '../../models';
import { mapPosToPos } from '../../levels/common';

export default function Enemies() {
  const {
    logic: {
      entities: { enemies },
    },
  } = useLevelData();

  return enemies.map((d, i) => {
    const {
      kind,
      position: { x, z },
    } = d;
    const Component = registry.enemies[kind];

    return <Component key={i} position={mapPosToPos(x, z)} />;
  });
}

function Enemy() {}
