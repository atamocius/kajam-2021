import React, { forwardRef } from 'react';

import { BufferGeometryLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import InstancedModel from '../../../helpers/instanced-model';

import { star32Mat as material } from '../../../materials';

const data = '/models/props/crates.json';

const CratesTemplate = forwardRef(({ count }, ref) => {
  const geometry = useLoader(BufferGeometryLoader, data);

  const def = [
    {
      geometry,
      material,
    },
  ];

  return <InstancedModel ref={ref} count={count} definition={def} />;
});

export default CratesTemplate;
