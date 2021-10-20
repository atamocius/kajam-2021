import React from 'react';

import { useInstancedModels } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function Crates(props) {
  const {
    stageProps: { crates },
  } = useInstancedModels();

  return <MeshInstance instancedModelRef={crates} {...props} />;
}
