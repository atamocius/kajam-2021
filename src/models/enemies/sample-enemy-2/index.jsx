import React, { useContext } from 'react';

import { InstancedModelsContext } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function SampleEnemy2(props) {
  const {
    enemies: { sampleEnemy2 },
  } = useContext(InstancedModelsContext);

  return <MeshInstance instancedModelRef={sampleEnemy2} {...props} />;
}
