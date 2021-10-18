import { useTexture } from '@react-three/drei';
import { NearestFilter, LinearMipMapLinearFilter } from 'three';

/**
 * @param {string} src
 */
export default function loadAtlas(src) {
  const [atlasTex] = useTexture([src]);
  atlasTex.magFilter = NearestFilter;
  atlasTex.minFilter = LinearMipMapLinearFilter;
  return atlasTex;
}
