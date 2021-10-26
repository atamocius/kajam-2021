import React from 'react';

import { useInstancedModels } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

export default function Alien1(props) {
  const {
    enemies: { alienBody, alienLegs },
  } = useInstancedModels();

  return (
    <group {...props}>
      <group position={[0, 0.5, 0]} rotation={[0, Math.PI * 0.5, 0]}>
        <group scale={0.035}>
          <group rotation={[0, 0, Math.PI * -0.13]}>
            <MeshInstance instancedModelRef={alienBody} />
            <group position={[-6, 0, 0]} rotation={[0, 0, Math.PI * -0.25]}>
              <MeshInstance
                instancedModelRef={alienLegs}
                rotation={[0, Math.PI * 0.5, 0]}
                scale={0.7}
              />
            </group>
          </group>
          <MeshInstance
            instancedModelRef={alienLegs}
            position={[3, 0, 0]}
            rotation={[0, Math.PI * -0.5, 0]}
          />
        </group>
      </group>
    </group>
  );
}
