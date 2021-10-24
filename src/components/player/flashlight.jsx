import { DEBUG_MODE } from '../../settings';

import React, { useRef, useMemo } from 'react';
import { SpotLight, SpotLightHelper } from 'three';
import { useHelper } from '@react-three/drei';

export default function Flashlight({ position, rotation }) {
  const spotLightRef = useRef();

  const spotLight = useMemo(() => new SpotLight(), []);

  if (DEBUG_MODE) {
    useHelper(spotLightRef, SpotLightHelper);
  }

  return (
    <group position={position} rotation={rotation}>
      <primitive
        ref={spotLightRef}
        object={spotLight}
        position={[0, 0, 0]}
        // color={0xffffff}
        // angle={Math.PI / 24}
        // angle={Math.PI / 12}
        angle={Math.PI / 6}
        distance={8}
        intensity={0.7}
        penumbra={0.2}
        castShadow
        shadow-mapSize-width={128}
        shadow-mapSize-height={128}
      />
      <primitive object={spotLight.target} position={[0, 0, 1]} />
    </group>
  );
}
