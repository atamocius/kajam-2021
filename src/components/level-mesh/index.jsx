/**
 * @typedef {import('three').Texture} Texture
 * @typedef {import('three').BufferGeometry} BufferGeometry
 */

import React from 'react';

/**
 * @param {{atlas: Texture, geometry: BufferGeometry}} param0
 */
export default function LevelMesh({ atlas, geometry }) {
  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshPhongMaterial attach='material' map={atlas} />
    </mesh>
  );
}
