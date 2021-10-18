import React, { forwardRef, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
// import { TextureLoader, MeshPhongMaterial } from 'three';

import InstancedModel from '../../helpers/instanced-model';

// import star32Png from '../../palettes/star32.png';

import { star32Mat as mat } from '../../materials';

const SampleEnemy2Template = forwardRef(({ count }, ref) => {
  const { nodes } = useGLTF('/models/enemies/sample-enemy2.glb');

  // const mat = useMemo(() => {
  //   // const atlasTex = new TextureLoader().load('/palettes/star32.png');
  //   // const atlasTex = new TextureLoader().load(star32Png);
  //   const [atlasTex] = useTexture([star32Png]);
  //   atlasTex.flipY = false;
  //   return new MeshPhongMaterial({
  //     map: atlasTex,
  //     specular: 0x808080,
  //   });
  // }, []);

  const def = [
    {
      geometry: nodes['generated(Clone)'].geometry,
      material: mat,
    },
  ];

  return <InstancedModel ref={ref} count={count} definition={def} />;
});

useGLTF.preload('/models/enemies/sample-enemy2.glb');

export default SampleEnemy2Template;
