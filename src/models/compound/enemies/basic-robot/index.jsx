import React from 'react';

import TestRobot from '../../../enemies/test-robot';

export default function BasicRobot({ ...rest }) {
  return (
    <group {...rest}>
      <group rotation={[0, 0, 0]} scale={1}>
        {/* <group rotation={[0, Math.PI / 4, 0]} scale={0.03}> */}
        <TestRobot />
      </group>
    </group>
  );
}
