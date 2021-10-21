import React from 'react';

import { useLevelData } from '../../logic/level-data-provider';

export default function LevelMesh() {
  const { atlas, geometry } = useLevelData();

  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshPhongMaterial attach='material' map={atlas} shininess={10} />
    </mesh>
  );
}
