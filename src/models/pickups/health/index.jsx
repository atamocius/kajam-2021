/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 */

import React, { useRef, useEffect } from 'react';

import { useInstancedModels } from '../../../meshes/instanced';
import MeshInstance from '../../../meshes/helpers/mesh-instance';

import { createInfiniteRotationAnim } from '../../../animations/infinite-rotation';

export default function Health(props) {
  const {
    pickups: { health: instRef },
  } = useInstancedModels();

  /** @type {React.MutableRefObject<GroupProps>} */
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const transform = {
      rotY: 0,
    };

    const anim = createInfiniteRotationAnim(
      transform,
      t => {
        ref.current.rotation.set(0, t.rotY, 0);
      },
      5000
    );

    return () => {
      anim.pause();
    };
  }, []);

  return (
    <group ref={ref} {...props}>
      <group position={[0, 0.35, 0]} scale={0.025}>
        <MeshInstance instancedModelRef={instRef} />
      </group>
    </group>
  );
}
