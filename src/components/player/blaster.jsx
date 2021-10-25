/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('three').Vector3} Vector3
 * @typedef {import('three').Euler} Euler
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { BufferGeometryLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import createGunRecoilAnim from '../../animations/gun-recoil';

import { star32Mat as material } from '../../meshes/materials';

const data = '/models/player/blaster.json';

function Model() {
  const geometry = useLoader(BufferGeometryLoader, data);
  return <mesh geometry={geometry} material={material} />;
}

/**
 * @typedef {Object} BlasterApi
 * @property {() => Promise<void>} recoil
 */

const Blaster = forwardRef(
  /**
   * @param {{ position: Vector3, rotation: Euler }} param0
   * @param {React.ForwardedRef<BlasterApi>} fwdRef
   */
  ({ position, rotation }, fwdRef) => {
    /** @type {React.MutableRefObject<GroupProps>} */
    const ref = useRef();

    useEffect(() => {
      if (!fwdRef) return;
      if (!ref.current) return;

      const transform = {
        rotX: 0,
      };

      const anim = createGunRecoilAnim(
        transform,
        t => {
          ref.current.rotation.set(t.rotX, 0, 0);
        },
        50,
        150,
        Math.PI * -0.2
      );

      const api = {
        recoil: async () => {
          anim.play();
          await anim.finished;
        },
      };

      fwdRef.current = api;

      return () => (fwdRef.current = null);
    }, []);

    return (
      <group position={position} rotation={rotation}>
        <group ref={ref} scale={[0.06, 0.05, 0.05]}>
          <Model />
        </group>
      </group>
    );
  }
);

export default Blaster;
