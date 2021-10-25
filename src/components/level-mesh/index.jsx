/**
 * @typedef {import('@react-three/fiber').PointLightProps} PointLightProps
 */

import React, { useEffect, useRef } from 'react';

import { useLevelData } from '../../utils/level-data-provider';
import { useGameLogic } from '../../logic/game-logic';

import { mapXToPosX, mapZToPosZ } from '../../levels/common';

const exitLockedColor = 0xff0000;
const exitUnlockedColor = 0x00ff00;

export default function LevelMesh() {
  /**
   * @type {React.MutableRefObject<PointLightProps>}
   */
  const lockedRef = useRef();
  /**
   * @type {React.MutableRefObject<PointLightProps>}
   */
  const unlockedRef = useRef();

  const {
    atlas,
    geometry,
    logic: { goal },
  } = useLevelData();

  const logic = useGameLogic();

  const x = mapXToPosX(goal.x);
  const z = mapZToPosZ(goal.z);

  useEffect(() => {
    if (!lockedRef.current) return;
    if (!unlockedRef.current) return;

    const unsub = logic.addKeyAcquiredListener(() => {
      lockedRef.current.intensity = 0;
      unlockedRef.current.intensity = 1;
    });

    return unsub;
  }, []);

  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshPhongMaterial attach='material' map={atlas} shininess={10} />
      <pointLight
        ref={lockedRef}
        position={[x, 0.75, z]}
        color={exitLockedColor}
        distance={3}
        intensity={1}
        castShadow
        shadow-mapSize-width={32}
        shadow-mapSize-height={32}
      />
      <pointLight
        ref={unlockedRef}
        position={[x, 0.75, z]}
        color={exitUnlockedColor}
        distance={3}
        intensity={0}
        castShadow
        shadow-mapSize-width={32}
        shadow-mapSize-height={32}
      />
    </mesh>
  );
}
