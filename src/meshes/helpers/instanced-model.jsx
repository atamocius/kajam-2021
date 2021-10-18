/**
 * @typedef {import('three').InstancedMesh} InstancedMesh
 * @typedef {import('three').Matrix4} Matrix4
 *
 * @typedef {import('../types').InstanceApi} InstanceApi
 * @typedef {import('../types').InstancedModelPart} InstancedModelPart
 * @typedef {import('../types').InstancedModelDefinition} InstancedModelDefinition
 */

import React, { useRef, forwardRef, useEffect } from 'react';
import { DynamicDrawUsage } from 'three';

const InstancedModel = forwardRef(
  /**
   * @param {{count: number, definition: InstancedModelDefinition}} param0
   * @param {React.ForwardedRef<InstanceApi>} ref
   */
  ({ count, definition }, ref) => {
    /** @type {React.MutableRefObject<InstancedMesh>[]} */
    const refs = Array.from({ length: definition.length }, useRef);

    useEffect(() => {
      if (!ref) {
        return;
      }

      ref.current = makeApi(count, refs);

      return () => {
        ref.current = null;
      };
    }, []);

    const meshes = definition.map((d, i) => (
      <instancedMesh
        key={i}
        ref={refs[i]}
        args={[null, null, count]}
        castShadow
        geometry={d.geometry}
        material={d.material}
      />
    ));

    return meshes;
  }
);

/**
 * @param {number} count
 * @param {React.MutableRefObject<InstancedMesh>[]} refs
 * @returns {InstanceApi}
 */
function makeApi(count, refs) {
  let indexCounter = 0;

  for (let i = 0; i < refs.length; i++) {
    refs[i].current.instanceMatrix.setUsage(DynamicDrawUsage);
  }

  return {
    getIndex: () => {
      if (indexCounter >= count) {
        console.warn(
          `InstancedModel: Reached max count (${count}). Consider increasing 'count'.`
        );
        indexCounter = 0;
      }

      return indexCounter++;
    },

    /**
     * @param {number} index
     * @param {Matrix4} matrix
     */
    getMatrixAt: (index, matrix) => {
      refs[0].current.getMatrixAt(index, matrix);
    },

    /**
     * @param {number} index
     * @param {Matrix4} matrix
     */
    setMatrixAt: (index, matrix) => {
      for (let i = 0; i < refs.length; i++) {
        const r = refs[i];
        r.current.setMatrixAt(index, matrix);
        r.current.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

export default InstancedModel;
