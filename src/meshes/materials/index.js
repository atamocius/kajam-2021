import { TextureLoader, MeshPhongMaterial } from 'three';

import star32Png from '../palettes/star32.png';

export const star32Mat = (() => {
  const atlasTex = new TextureLoader().load(star32Png);
  atlasTex.flipY = false;
  return new MeshPhongMaterial({
    map: atlasTex,
  });
})();
