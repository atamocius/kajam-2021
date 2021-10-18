import { BufferGeometry, BufferAttribute } from 'three';

export function processGeometryData({ vertices, normals, uvs, indices }) {
  const geometry = new BufferGeometry();

  const vb = new Float32Array(vertices);
  const nb = new Float32Array(normals);
  const tb = new Float32Array(uvs);
  const ib = new Uint16Array(indices);

  geometry
    .setAttribute('position', new BufferAttribute(vb, 3))
    .setAttribute('normal', new BufferAttribute(nb, 3))
    .setAttribute('uv', new BufferAttribute(tb, 2))
    .setAttribute('index', new BufferAttribute(ib, 1));

  return geometry;
}
