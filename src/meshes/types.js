/**
 * @typedef {import("three").Matrix4} Matrix4
 * @typedef {import("three").BufferGeometry} BufferGeometry
 * @typedef {import("three").Material} Material
 */

/**
 * @typedef {Object} InstanceApi
 * @property {() => number} getIndex
 * @property {(index: number, matrix: Matrix4) => void} getMatrixAt
 * @property {(index: number, matrix: Matrix4) => void} setMatrixAt
 */

/**
 * @typedef {Object} InstancedModelPart
 * @property {BufferGeometry} geometry
 * @property {Material} material
 */

/**
 * @typedef {InstancedModelPart[]} InstancedModelDefinition
 */

export {};
