import React from 'react';

import { useLevelData } from '../../utils/level-data-provider';
import registry from '../../models';

import Enemy from './enemy';

export default function Enemies() {
  const {
    logic: {
      entities: { enemies },
    },
  } = useLevelData();

  return enemies.map((d, i) => {
    const { kind } = d;
    const Component = registry.enemies[kind];

    return (
      <Enemy key={i} id={i}>
        <Component position={[0, 0, 0]} />
      </Enemy>
    );
  });
}
