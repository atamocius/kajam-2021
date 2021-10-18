import React, { useContext } from 'react';

import { InstancedModelsContext } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function TestRobot(props) {
  const {
    enemies: { testRobot },
  } = useContext(InstancedModelsContext);

  return <MeshInstance instancedModelRef={testRobot} {...props} />;
}
