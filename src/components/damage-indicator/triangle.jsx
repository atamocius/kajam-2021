import React, { forwardRef } from 'react';

// prettier-ignore
const vertices = new Float32Array([
  -1.5, -0.5,  0.0, // left bottom
   0.5, -0.5,  0.0, // right bottom
   0.5,  1.5,  0.0, // right top
]);

// prettier-ignore
const normals = new Float32Array([
   0,  0,  1, // left bottom
   0,  0,  1, // right bottom
   0,  0,  1, // right top
]);

// prettier-ignore
const indices = new Uint16Array([
   2,  1,  0,
])

const Triangle = forwardRef(
  ({ position, rotation, scale, color, opacity, renderOrder }, fwdRef) => {
    return (
      <mesh
        position={position}
        rotation={rotation}
        scale={scale}
        renderOrder={renderOrder}
      >
        <bufferGeometry attach='geometry' index={indices}>
          <bufferAttribute
            attach='index'
            array={indices}
            count={indices.length}
            itemSize={1}
          />
          <bufferAttribute
            attachObject={['attributes', 'position']}
            array={vertices}
            count={vertices.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attachObject={['attributes', 'normal']}
            array={normals}
            count={normals.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <meshBasicMaterial
          ref={fwdRef}
          attach='material'
          color={color}
          depthTest={false}
          depthWrite={false}
          transparent
          opacity={opacity}
        />
      </mesh>
    );
  }
);

export default Triangle;
