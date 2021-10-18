import React, { useRef, useMemo } from 'react';

import {
  SpotLight,
  PointLight,
  SpotLightHelper,
  PointLightHelper,
} from 'three';
import { useHelper } from '@react-three/drei';

import loadLevel from '../../utils/level-loader';
import LevelMesh from '../../components/level-mesh';

import InstancedModelsProvider from '../../meshes/instanced';
import BasicEnemy2 from '../../models/compound/enemies/basic-enemy-2';
import BasicRobot from '../../models/compound/enemies/basic-robot';

const instancedModelsConfig = {
  enemies: {
    sampleEnemy2: 25,
    testRobot: 25,
  },
};

export default function Level0() {
  const level = loadLevel(
    '/levels/level0/data.json',
    '/levels/level0/geometry.json'
  );

  const { atlas, geometry } = level;

  return (
    <>
      {/* <color attach='background' args={['#a1eeee']} /> */}
      <hemisphereLight intensity={0.35} />
      <directionalLight
        position={[5, 5, 5]}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
      />

      {/* <ambientLight intensity={0.01} />
      <Flashlight
        position={[1.5, 0.5, 1.5]}
        rotation={[0, Math.PI / 2, 0]}
      /> */}

      <LevelMesh atlas={atlas} geometry={geometry} />
      <Enemies />
    </>
  );
}

function Enemies() {
  return (
    <InstancedModelsProvider config={instancedModelsConfig}>
      <group position={[2.5, 0, 1.5]}>
        <group scale={[1, 1, 1]}>
          <group position={[0, 0.5, 0]}>
            <BasicEnemy2 />
          </group>
        </group>
      </group>

      <group position={[0, 0, 0]}>
        <BasicRobot />
      </group>
    </InstancedModelsProvider>
  );
}

function Flashlight({ position, rotation }) {
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
        angle={Math.PI / 8}
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
