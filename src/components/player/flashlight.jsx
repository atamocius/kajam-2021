import React, { useRef, useMemo } from 'react';
import {
  SpotLight,
  PointLight,
  SpotLightHelper,
  PointLightHelper,
} from 'three';
import { useHelper } from '@react-three/drei';

export default function Flashlight({ position, rotation }) {
  const spotLightRef = useRef();
  // const pointLightRef = useRef();

  const spotLight = useMemo(() => new SpotLight(), []);
  // const pointLight = useMemo(() => new PointLight(), []);

  useHelper(spotLightRef, SpotLightHelper);
  // useHelper(pointLightRef, PointLightHelper);

  return (
    <group position={position} rotation={rotation}>
      <primitive
        ref={spotLightRef}
        object={spotLight}
        position={[0, 0, 0]}
        // color={0xffffff}
        // angle={Math.PI / 24}
        angle={Math.PI / 12}
        // angle={Math.PI / 8}
        distance={8}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={128}
        shadow-mapSize-height={128}
      />
      <primitive object={spotLight.target} position={[0, 0, 1]} />
      <pointLight
        // ref={pointLightRef}
        position={[0, 0, 1]}
        // color={0xffffff}
        distance={2}
        intensity={0.15}
        // castShadow
        // shadow-mapSize-width={64}
        // shadow-mapSize-height={64}
      />
    </group>
  );
}
