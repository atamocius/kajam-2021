import React from 'react';

import { useInstancedModels } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function Bot(props) {
  const {
    enemies: { bot },
  } = useInstancedModels();

  return <MeshInstance instancedModelRef={bot} {...props} />;
}
