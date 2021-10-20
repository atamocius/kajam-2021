import React, { useContext } from 'react';

import { InstancedModelsContext } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function Crates(props) {
  const {
    stageProps: { crates },
  } = useContext(InstancedModelsContext);

  return <MeshInstance instancedModelRef={crates} {...props} />;
}
