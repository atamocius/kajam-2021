/**
 * @typedef {import('./types.js').LevelData} LevelData
 * @typedef {import('./types.js').LoadedLevelData} LoadedLevelData
 */

import loadAtlas from './atlas-loader.js';
import tessellateMap from './tessellation-funcs.js';

/**
 * @param {LevelData} levelData
 * @return {LoadedLevelData}
 */
export default function loadLevel(levelData) {
  const level = tessellateMap(levelData);
  level.geometry.atlas = loadAtlas(levelData.atlas.src);
  return level;
}
