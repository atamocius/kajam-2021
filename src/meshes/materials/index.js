import { TextureLoader, MeshPhongMaterial } from 'three';

export const star32Mat = (() => {
  const atlasTex = new TextureLoader().load('/palettes/star32.png');
  atlasTex.flipY = false;
  return new MeshPhongMaterial({
    map: atlasTex,
  });
})();
