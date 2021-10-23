import React from 'react';

import { useLevelData } from '../../utils/level-data-provider';
import registry from '../../models';
import { mapPosToPos } from '../../levels/common';

export default function Pickups() {
  const {
    logic: {
      entities: { pickups },
    },
  } = useLevelData();

  return pickups.map((d, i) => {
    const {
      kind,
      position: { x, z },
    } = d;
    const Component = registry.pickups[kind];

    return <Component key={i} position={mapPosToPos(x, z)} />;
  });
}
