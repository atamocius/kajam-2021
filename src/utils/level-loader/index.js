/**
 * @typedef {import('./types.js').LevelData} LevelData
 * @typedef {import('./types.js').LoadedLevelData} LoadedLevelData
 */

import { FileLoader, BufferGeometryLoader } from 'three';
import { useLoader } from '@react-three/fiber';

import loadAtlas from './atlas-loader.js';
import createMapUtilFuncs from './map-util-funcs.js';

/**
 * @param {string} levelDataUrl
 * @param {string} geometryDataUrl
 * @return {LoadedLevelData}
 */
export default function loadLevel(levelDataUrl, geometryDataUrl) {
  const data = useLoader(FileLoader, levelDataUrl);
  const geometry = useLoader(BufferGeometryLoader, geometryDataUrl);

  /**
   * @type {LevelData}
   */
  const levelData = JSON.parse(data);
  const { atlas, map } = levelData;

  const atlasTex = loadAtlas(atlas.src);
  const mapUtils = createMapUtilFuncs(map);

  return {
    atlas: atlasTex,
    size: map.size,
    logic: map.logic,
    geometry,
    utils: mapUtils,
  };
}
