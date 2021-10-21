import React from 'react';

import { useLevelData } from '../../utils/level-data-provider';
import registry from '../../models';
import { mapPosToPos } from '../../levels/common';

export default function StageProps() {
  const {
    logic: {
      entities: { props },
    },
  } = useLevelData();

  return props.map((d, i) => {
    const {
      kind,
      position: { x, z },
      rotation: { y: rotY },
    } = d;
    const Component = registry.stageProps[kind];

    return (
      <Component key={i} position={mapPosToPos(x, z)} rotation={[0, rotY, 0]} />
    );
  });
}
