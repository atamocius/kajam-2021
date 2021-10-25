/**
 * @typedef {import('three').Vector3} Vector3
 * @typedef {import('@react-three/fiber').PerspectiveCameraProps} PerspectiveCameraProps
 */

import { DEBUG_MODE } from '../../settings';

import React, { useRef, useEffect } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';
import { useAudioManager } from '../../utils/audio-manager';

/**
 * @param {{ position: Vector3 }} param0
 */
export default function Camera({ position }) {
  /**
   * @type {React.MutableRefObject<PerspectiveCameraProps>}
   */
  const ref = useRef();

  const audioMgr = useAudioManager();

  useEffect(() => {
    if (!ref.current) return;

    const target = new Vector3();
    ref.current.getWorldPosition(target);
    target.add(new Vector3(0, 0, 1));

    ref.current.lookAt(target);

    ref.current.add(audioMgr.listener);

    return () => {
      ref.current.remove(audioMgr.listener);
    };
  }, []);

  if (DEBUG_MODE) {
    return null;
  }

  return (
    <group position={position}>
      <PerspectiveCamera ref={ref} makeDefault position={[0, 0, 0]} fov={65} />
    </group>
  );
}
