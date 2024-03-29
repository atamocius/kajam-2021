import { DEBUG_MODE } from '../../settings';

import React, { useRef } from 'react';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';

export default function Gizmo() {
  const ref = useRef();

  if (!DEBUG_MODE) {
    return null;
  }

  return (
    <>
      <hemisphereLight intensity={0.35} />
      <directionalLight
        position={[5, 5, 5]}
        penumbra={1}
        intensity={1}
        // castShadow
        // shadow-mapSize-width={256}
        // shadow-mapSize-height={256}
      />

      <gridHelper renderOrder={999} args={[1000, 1000, 0xaa0000, 0x222222]} />

      <GizmoHelper
        renderPriority={0}
        alignment='bottom-right'
        margin={[100, 100]}
        onTarget={() => ref.current.target}
        onUpdate={() => ref.current.update()}
      >
        <GizmoViewport hideNegativeAxes />
      </GizmoHelper>

      <OrbitControls ref={ref} />
    </>
  );
}
