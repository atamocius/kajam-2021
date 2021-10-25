/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 */

import React, { useRef, useEffect } from 'react';
import { BufferGeometryLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import createInfiniteRotationAnim from '../../../animations/infinite-rotation';

import { star32Mat as material } from '../../../meshes/materials';

const data = '/models/pickups/keycard.json';

export default function Key(props) {
  /** @type {React.MutableRefObject<GroupProps>} */
  const ref = useRef();

  const geometry = useLoader(BufferGeometryLoader, data);

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
      10000
    );

    return () => {
      anim.pause();
    };
  }, []);

  return (
    <group ref={ref} {...props}>
      <group position={[0, 0.4, 0]} scale={0.015}>
        <mesh geometry={geometry} material={material} />
      </group>
    </group>
  );
}
