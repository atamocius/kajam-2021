/**
 * @typedef {import('@react-three/fiber').PointLightProps} PointLightProps
 * @typedef {import('three').Vector3} Vector3
 */

import React, { forwardRef, useRef, useEffect } from 'react';

import createMuzzleFlashAnim from '../../animations/muzzle-flash';

/**
 * @typedef {Object} MuzzleFlashApi
 * @property {() => Promise<void>} flash
 */

const MuzzleFlash = forwardRef(
  /**
   * @param {{ position: Vector3 }} param0
   * @param {React.ForwardedRef<MuzzleFlashApi>} fwdRef
   */
  ({ position }, fwdRef) => {
    /** @type {React.MutableRefObject<PointLightProps>} */
    const ref = useRef();

    useEffect(() => {
      if (!fwdRef) return;
      if (!ref.current) return;

      const properties = {
        intensity: 0,
      };

      const anim = createMuzzleFlashAnim(
        properties,
        p => {
          ref.current.intensity = p.intensity;
        },
        50,
        50,
        1
      );

      const api = {
        flash: async () => {
          anim.play();
          await anim.finished;
        },
      };

      fwdRef.current = api;

      return () => (fwdRef.current = null);
    }, []);

    return (
      <pointLight
        ref={ref}
        position={position}
        color={0xffffff}
        distance={8}
        intensity={0}
      />
    );
  }
);

export default MuzzleFlash;
