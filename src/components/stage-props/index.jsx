/**
 * @typedef {import('../../utils/level-loader/types').StagePropEntity} StagePropEntity
 */

import React from 'react';

import { mapPosToPos } from '../../levels/common';

/**
 * @typedef {{ [x: string]: (props: any) => JSX.Element }} ModelLookup
 */

/**
 * @param {{ data: StagePropEntity[], modelLookup: ModelLookup }} param0
 */
export default function StageProps({ data, modelLookup }) {
  return data.map((d, i) => {
    const {
      kind,
      position: { x, z },
      rotation: { y: rotY },
    } = d;
    const Component = modelLookup[kind];

    return (
      <group key={i} position={mapPosToPos(x, z)} rotation={[0, rotY, 0]}>
        <Component />
      </group>
    );
  });
}
