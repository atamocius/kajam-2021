/**
 * @typedef {import('./types.js').AtlasCoords} AtlasCoords
 */

/**
 * @param {(index: number) => AtlasCoords} atlasIndexToCoords
 * @param {number} atlasTileUnitSize
 */
export default function createGenerateQuadUVsFunc(
  atlasIndexToCoords,
  atlasTileUnitSize
) {
  /**
   * @param {number} index
   * @param {number[]} uvBuffer
   */
  const generateQuadUVs = (index, uvBuffer) => {
    const { u, v } = atlasIndexToCoords(index);

    const left = u;
    const top = v;
    const right = left + atlasTileUnitSize;
    const bottom = top - atlasTileUnitSize;

    // prettier-ignore
    uvBuffer.push(
      left , bottom,
      right, bottom,
      left , top   ,
      right, top   ,
    );
  };

  return generateQuadUVs;
}
