/**
 * @typedef {import('three').Vector3} Vector3
 * @typedef {import('three').Color} Color
 */

import React, { useRef, useEffect, forwardRef } from 'react';

import { Text } from '@react-three/drei';
import padStart from 'lodash-es/padStart';

import { delay } from '../../utils/promise';

const font = '/fonts/SpaceMono-Regular.ttf';
const color = '#823400';
const outlineWidth = 0.8;
const outlineColor = '#000000';

const HudColors = {
  success: '#1d9100',
  danger: '#820000',
};

/**
 * @typedef {Object} HeadsUpDisplayApi
 * @property {(health: number) => void} updateHealth
 * @property {(ammo: number) => void} updateAmmo
 * @property {(msg: string) => Promise<void>} showSuccessMessage
 * @property {(msg: string) => Promise<void>} showDangerMessage
 */

const HeadsUpDisplay = forwardRef(
  /**
   * @param {{ position: Vector3 }} param0
   * @param {React.ForwardedRef<HeadsUpDisplayApi>} fwdRef
   */
  ({ position }, fwdRef) => {
    const healthRef = useRef();
    const ammoRef = useRef();
    const msgRef = useRef();

    useEffect(() => {
      if (!fwdRef) return;
      if (!healthRef.current) return;
      if (!ammoRef.current) return;

      const showMessage = async (msg, color) => {
        msgRef.current.text = msg;
        msgRef.current.color = color;
        msgRef.current.position.setY(0);
        await delay(3000);
        msgRef.current.position.setY(-100);
      };

      fwdRef.current = {
        updateHealth: health => {
          healthRef.current.text = `Health:${padStart(health.toString(), 3)}`;
        },

        updateAmmo: ammo => {
          ammoRef.current.text = `Ammo:${padStart(ammo.toString(), 3)}`;
        },

        showSuccessMessage: msg => showMessage(msg, HudColors.success),
        showDangerMessage: msg => showMessage(msg, HudColors.danger),
      };

      return () => (fwdRef.current = null);
    }, []);

    return (
      <group position={position} rotation={[0, Math.PI, 0]}>
        <group position={[0, 0, -0.1]}>
          <Text
            ref={healthRef}
            position={[-0.0845, -0.055, 0]}
            scale={0.001}
            color={color}
            fontSize={8}
            font={font}
            outlineWidth={outlineWidth}
            outlineColor={outlineColor}
          />
          <Text
            ref={ammoRef}
            position={[0.0885, -0.055, 0]}
            scale={0.001}
            color={color}
            fontSize={8}
            font={font}
            outlineWidth={outlineWidth}
            outlineColor={outlineColor}
          />
          <Text
            ref={msgRef}
            position={[0, -100, 0]}
            scale={0.001}
            color={HudColors.success}
            fontSize={8}
            font={font}
            outlineWidth={outlineWidth}
            outlineColor={outlineColor}
          />
        </group>
      </group>
    );
  }
);

export default HeadsUpDisplay;
