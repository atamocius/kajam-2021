import React from 'react';

import { useInstancedModels } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function SampleEnemy2(props) {
  const {
    enemies: { sampleEnemy2 },
  } = useInstancedModels();

  return <MeshInstance instancedModelRef={sampleEnemy2} {...props} />;
}
