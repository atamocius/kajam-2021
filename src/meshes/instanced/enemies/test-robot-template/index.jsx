import React, { forwardRef, useMemo } from 'react';

import InstancedModel from '../../../helpers/instanced-model';
import { processGeometryData } from '../../../helpers/geometry-utils';

import { star32Mat as material } from '../../../materials';
import data from './geometry.json';

const TestRobotTemplate = forwardRef(({ count }, ref) => {
  const geometry = useMemo(() => processGeometryData(data), []);
  const def = [
    {
      geometry,
      material,
    },
  ];

  return <InstancedModel ref={ref} count={count} definition={def} />;
});

export default TestRobotTemplate;
