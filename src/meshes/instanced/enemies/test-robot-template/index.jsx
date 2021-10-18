import React, { forwardRef, useMemo } from 'react';

import { BufferGeometryLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import InstancedModel from '../../../helpers/instanced-model';

import { star32Mat as material } from '../../../materials';

const data = '/models/enemies/test-robot.json';

const TestRobotTemplate = forwardRef(({ count }, ref) => {
  const geometry = useLoader(BufferGeometryLoader, data);

  const def = [
    {
      geometry,
      material,
    },
  ];

  return <InstancedModel ref={ref} count={count} definition={def} />;
});

export default TestRobotTemplate;