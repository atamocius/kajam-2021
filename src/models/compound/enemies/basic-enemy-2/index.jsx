import React from 'react';

import SampleEnemy2 from '../../../enemies/sample-enemy-2';

export default function BasicEnemy2({ ...rest }) {
  return (
    <group {...rest}>
      {/* <group rotation={[0, Math.PI / 4, 0]} scale={0.5}> */}
      <group rotation={[0, Math.PI / 4, 0]} scale={0.03}>
        <SampleEnemy2 />
      </group>
    </group>
  );
}
