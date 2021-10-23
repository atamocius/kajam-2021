import PriorityQueue from 'priorityqueuejs';

export function distance(x1, y1, x2, y2) {
  const a = x2 - x1;
  const b = y2 - y1;
  return Math.sqrt(a * a + b * b);
}

export function manhattanDist(x, y, goalX, goalY) {
  const dx = Math.abs(x - goalX);
  const dy = Math.abs(y - goalY);
  return dx + dy;
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} t
 */
export function lerp(start, end, t) {
  return start + t * (end - start);
}

/**
 * @param {{ x: number, y: number }} p0
 * @param {{ x: number, y: number }} p1
 */
export function* line(p0, p1) {
  let n = diagonalDist(p0, p1);

  for (let step = 0; step <= n; step++) {
    let t = n === 0 ? 0.0 : step / n;
    yield roundPoint(lerpPoint(p0, p1, t));
  }
}

/**
 * @param {{ x: number, y: number }} p0
 * @param {{ x: number, y: number }} p1
 */
function diagonalDist(p0, p1) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
}

/**
 * @param {{ x: number, y: number }} p
 */
function roundPoint(p) {
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

/**
 * @param {{ x: number, y: number }} p0
 * @param {{ x: number, y: number }} p1
 * @param {number} t
 */
function lerpPoint(p0, p1, t) {
  return { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) };
}

function createPathfinder() {
  // new PriorityQueue()
}
