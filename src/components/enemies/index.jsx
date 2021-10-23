import React from 'react';
import { useFrame } from '@react-three/fiber';

import { useLevelData } from '../../utils/level-data-provider';
import registry from '../../models';

import Enemy from './enemy';

import { useGameLogic } from '../../logic/game-logic';

export default function Enemies() {
  const {
    logic: {
      entities: { enemies },
    },
  } = useLevelData();

  const { enemies: logic } = useGameLogic();

  // AI
  useFrame(() => {
    if (!logic.isBusy) {
      logic.moveTowardsPlayer();
    }
  });

  return enemies.map((d, i) => {
    const { kind } = d;
    const Component = registry.enemies[kind];

    return (
      <Enemy key={i} index={i}>
        <Component position={[0, 0, 0]} />
      </Enemy>
    );
  });
}
