import classes from './index.module.css';

import React, { Suspense, useState, useRef, useMemo, useEffect } from 'react';

import { useRouter } from '../../utils/router';
import { routes as r } from '..';
import { useKeyDownNoRepeat } from '../../utils/keyboard';
import Shutter from '../../components/shutter';

import { Canvas } from '@react-three/fiber';
import {
  Box,
  GizmoHelper,
  OrbitControls,
  GizmoViewport,
  useHelper,
} from '@react-three/drei';

import loadLevel from '../../utils/level-loader';

import levelData from '../../assets/levels/sample';

import {
  SpotLight,
  PointLight,
  SpotLightHelper,
  PointLightHelper,
} from 'three';

import InstancedModelsProvider from '../../meshes/instanced';
import BasicEnemy2 from '../../models/compound/enemies/basic-enemy-2';
// import BasicRobot from '../../models/compound/enemies/basic-robot';

const instancedModelsConfig = {
  enemies: {
    sampleEnemy2: 25,
    testRobot: 25,
  },
};

export default function Gameplay() {
  const [shutterOpen, setShutterOpen] = useState(true);
  const { changeRoute } = useRouter();

  // const orbitRef = useRef();

  const exitToMenu = () => {
    setShutterOpen(false);
  };

  const handleShutterClosed = () => {
    changeRoute(r.main);
  };

  /**
   * @param {KeyboardEvent} ev
   */
  const handleKeyDown = async ev => {
    switch (ev.code) {
      case 'Escape':
        ev.preventDefault();
        exitToMenu();
        break;

      case 'F1':
        ev.preventDefault();
        console.log('Help');
        break;

      // WASD
      case 'KeyW':
        ev.preventDefault();
        console.log('Forward');
        break;

      case 'KeyS':
        ev.preventDefault();
        console.log('Backward');
        break;

      case 'KeyA':
        ev.preventDefault();
        console.log('Strafe Left');
        break;

      case 'KeyD':
        ev.preventDefault();
        console.log('Strafe Right');
        break;

      // Turn
      case 'KeyQ':
        ev.preventDefault();
        console.log('Turn Left');
        break;

      case 'KeyE':
        ev.preventDefault();
        console.log('Turn Right');
        break;

      // Reload
      case 'KeyR':
        ev.preventDefault();
        console.log('Reload');
        break;

      default:
        break;
    }
  };

  useKeyDownNoRepeat(handleKeyDown);

  return (
    <>
      <div className={classes.base}>
        <Canvas
          shadows
          gl={{ alpha: false }}
          camera={{ position: [0, 2, 2], fov: 50 }}
        >
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

          <Suspense fallback={null}>
            <LevelMesh />
            <Enemies />
          </Suspense>

          <Gizmo />
        </Canvas>
      </div>
      <Shutter open={shutterOpen} onClosed={handleShutterClosed} />
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

      {/* <group position={[0, 0, 0]}>
        <BasicRobot />
      </group> */}
    </InstancedModelsProvider>
  );
}

function Flashlight({ position, rotation }) {
  const spotLightRef = useRef();
  // const pointLightRef = useRef();

  // const target = useMemo(() => new Object3D(), []);

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
        // object={pointLight}
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

function LevelMesh() {
  // const [colorMap] = useTexture([wallTexPng]);
  // colorMap.magFilter = NearestFilter;
  // colorMap.minFilter = LinearMipMapLinearFilter;

  // const vertexBuffer = [];
  // const normalBuffer = [];
  // const uvBuffer = [];
  // const indexBuffer = [];

  // tessellateSouthWall(
  //   1,
  //   9,
  //   3,
  //   4,
  //   vertexBuffer,
  //   normalBuffer,
  //   uvBuffer,
  //   indexBuffer
  // );

  // // prettier-ignore
  // const vertices = new Float32Array([
  //   -0.5, -0.5,  0.0, // left bottom
  //    0.5, -0.5,  0.0, // right bottom
  //   -0.5,  0.5,  0.0, // left top
  //    0.5,  0.5,  0.0, // right top
  // ]);

  // // prettier-ignore
  // const normals = new Float32Array([
  //    1.0,  0.0,  0.0, // left bottom
  //    1.0,  0.0,  0.0, // right bottom
  //    1.0,  0.0,  0.0, // left top
  //    1.0,  0.0,  0.0, // right top
  // ]);

  // prettier-ignore
  // const uvs = new Float32Array([
  //   0.0,  0.0, // left bottom
  //   0.25, 0.0, // right bottom
  //   0.0,  0.25, // left top
  //   0.25, 0.25, // right top
  // ]);

  // // prettier-ignore
  // const vertices = new Float32Array([
  //   -0.5,  0.0,  0.5, // left top
  //    0.5,  0.0,  0.5, // right top
  //   -0.5,  0.0, -0.5, // left bottom
  //    0.5,  0.0, -0.5, // right bottom
  // ]);

  // // prettier-ignore
  // const vertices = new Float32Array([
  //   -1.0,  0.0,  0.0, // bottom left
  //   -1.0,  0.0,  1.0, // bottom right
  //    0.0,  0.0,  0.0, // top left
  //    0.0,  0.0,  1.0, // top right
  // ]);

  // // prettier-ignore
  // const vertices = new Float32Array(mapIndexToFloorVertices(1, 3));

  // // prettier-ignore
  // const normals = new Float32Array([
  //   0.0,  1.0,  0.0, // bottom left
  //   0.0,  1.0,  0.0, // bottom right
  //   0.0,  1.0,  0.0, // top left
  //   0.0,  1.0,  0.0, // top right
  // ]);

  // const uvs = new Float32Array(atlasIndexToUVs(9, 4));

  // // prettier-ignore
  // const indices = new Uint32Array([
  //   0,  1,  2,   2,  1,  3,
  // ]);

  // const vertices = new Float32Array(vertexBuffer);
  // const normals = new Float32Array(normalBuffer);
  // const uvs = new Float32Array(uvBuffer);
  // const indices = new Uint32Array(indexBuffer);

  const level = loadLevel(levelData);

  const { atlas, vertices, normals, uvs, indices } = level.geometry;

  return (
    <mesh castShadow receiveShadow>
      <bufferGeometry attach='geometry' index={indices}>
        <bufferAttribute
          attach='index'
          array={indices}
          count={indices.length}
          itemSize={1}
        />
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={vertices}
          count={vertices.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'normal']}
          array={normals}
          count={normals.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'uv']}
          array={uvs}
          count={uvs.length / 2}
          itemSize={2}
        />
      </bufferGeometry>
      {/* <meshBasicMaterial attach="material" color={0xff0000} /> */}
      <meshStandardMaterial attach='material' map={atlas} />
    </mesh>
  );
}

function Gizmo() {
  const ref = useRef();

  return (
    <>
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
