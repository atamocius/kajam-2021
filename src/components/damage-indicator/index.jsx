/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('@react-three/fiber').MeshBasicMaterialProps} MeshBasicMaterialProps
 * @typedef {import('three').Vector3} Vector3
 * @typedef {import('three').Euler} Euler
 * @typedef {import('three').Color} Color
 */

import React, { forwardRef, useRef, useEffect } from 'react';

import Triangle from './triangle';
import createDamageFlashAnim from '../../animations/damage-flash';

/**
 * @typedef {Object} DamageIndicatorApi
 * @property {() => Promise<void>} flash
 */

const DamageIndicator = forwardRef(
  /**
   * @param {{ position: Vector3, rotation: Euler, scale: Vector3, color: Color }} param0
   * @param {*} fwdRef
   */
  ({ position, rotation, scale, color }, fwdRef) => {
    /** @type {React.MutableRefObject<GroupProps>} */
    const ref = useRef();

    /** @type {React.MutableRefObject<MeshBasicMaterialProps>} */
    const matRef = useRef();

    useEffect(() => {
      if (!fwdRef) return;
      if (!matRef.current) return;

      const properties = {
        opacity: 0,
      };

      const anim = createDamageFlashAnim(
        properties,
        p => {
          matRef.current.opacity = p.opacity;
        },
        60,
        300,
        0.25
      );

      const setVisibility = isVisible => {
        if (isVisible) {
          ref.current.position.setY(0);
        } else {
          ref.current.position.setY(-100);
        }
      };

      const api = {
        flash: async () => {
          setVisibility(true);
          anim.play();
          await anim.finished;
          setVisibility(false);
        },
      };

      fwdRef.current = api;
    }, []);

    return (
      <group position={position} rotation={rotation}>
        <group ref={ref} position={[0, -100, 0]}>
          <Triangle
            ref={matRef}
            scale={scale}
            color={color}
            opacity={0}
            renderOrder={1000}
          />
        </group>
      </group>
    );
  }
);

export default DamageIndicator;
