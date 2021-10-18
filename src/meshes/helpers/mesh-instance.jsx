/**
 * @typedef {import('../types').InstanceApi} InstanceApi
 */

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * @param {{instancedModelRef: React.MutableRefObject<InstanceApi>}} param0
 */
export default function MeshInstance({ instancedModelRef, ...rest }) {
  const groupRef = useRef();
  const [index, setIndex] = useState();

  useEffect(() => {
    if (!instancedModelRef.current) {
      console.error(
        `MeshInstance must be used within a InstancedModelsProvider.`
      );
    }

    setIndex(instancedModelRef.current.getIndex());
  }, []);

  useFrame(() => {
    if (!instancedModelRef.current) {
      return;
    }
    instancedModelRef.current.setMatrixAt(index, groupRef.current.matrixWorld);
  });

  return <group ref={groupRef} {...rest} />;
}
