import React from 'react';

import { useLevelData } from '../../utils/level-data-provider';

import { mapXToPosX, mapZToPosZ } from '../../levels/common';

export default function LevelMesh() {
  const {
    atlas,
    geometry,
    logic: { goal },
  } = useLevelData();

  const x = mapXToPosX(goal.x);
  const z = mapZToPosZ(goal.z);

  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshPhongMaterial attach='material' map={atlas} shininess={10} />
      <pointLight
        position={[x, 0.75, z]}
        color={0x00ff00}
        distance={3}
        intensity={1}
        castShadow
        shadow-mapSize-width={32}
        shadow-mapSize-height={32}
      />
    </mesh>
  );
}
