/**
 * @typedef {import('three').Vector3} Vector3
 */

import React, { useRef, useEffect, forwardRef } from 'react';

import { Text } from '@react-three/drei';

import padStart from 'lodash-es/padStart';

const font = '/fonts/SpaceMono-Regular.ttf';
const color = '#823400';

/**
 * @typedef {Object} HeadsUpDisplayApi
 * @property {(health: number) => void} updateHealth
 * @property {(ammo: number) => void} updateAmmo
 */

const HeadsUpDisplay = forwardRef(
  /**
   * @param {{ position: Vector3 }} param0
   * @param {React.ForwardedRef<HeadsUpDisplayApi>} fwdRef
   */
  ({ position }, fwdRef) => {
    const healthRef = useRef();
    const ammoRef = useRef();

    useEffect(() => {
      if (!fwdRef) return;
      if (!healthRef.current) return;
      if (!ammoRef.current) return;

      fwdRef.current = {
        updateHealth: health => {
          healthRef.current.text = `Health:${padStart(health.toString(), 3)}`;
        },

        updateAmmo: ammo => {
          ammoRef.current.text = `Ammo:${padStart(ammo.toString(), 3)}`;
        },
      };
    }, []);

    return (
      <group position={position}>
        <group position={[0, 0, 0.1]}>
          <Text
            ref={healthRef}
            position={[0.0845, -0.055, 0]}
            scale={[-0.001, 0.001, 0.001]}
            color={color}
            fontSize={8}
            font={font}
          />
          <Text
            ref={ammoRef}
            position={[-0.0885, -0.055, 0]}
            scale={[-0.001, 0.001, 0.001]}
            color={color}
            fontSize={8}
            font={font}
          />
        </group>
      </group>
    );
  }
);

export default HeadsUpDisplay;
