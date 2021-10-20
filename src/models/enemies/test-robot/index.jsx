import React from 'react';

import { useInstancedModels } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function TestRobot(props) {
  const {
    enemies: { testRobot },
  } = useInstancedModels();

  return <MeshInstance instancedModelRef={testRobot} {...props} />;
}
