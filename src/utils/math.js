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
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {Point} p0
 * @param {Point} p1
 */
export function* line(p0, p1) {
  let n = diagonalDist(p0, p1);

  for (let step = 0; step <= n; step++) {
    let t = n === 0 ? 0.0 : step / n;
    yield roundPoint(lerpPoint(p0, p1, t));
  }
}

/**
 * @param {Point} p0
 * @param {Point} p1
 */
function diagonalDist(p0, p1) {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
}

/**
 * @param {Point} p
 */
function roundPoint(p) {
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

/**
 * @param {Point} p0
 * @param {Point} p1
 * @param {number} t
 */
function lerpPoint(p0, p1, t) {
  return { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) };
}

/**
 * @param {(p: Point) => Point[]} neighbors
 */
export function createPathfinder(neighbors) {
  /**
   * @param {Point} a
   * @param {Point} b
   */
  const isPosEqual = (a, b) => a.x === b.x && a.y === b.y;

  /**
   * @param {Point} a
   * @param {Point} b
   */
  const heuristic = (a, b) => manhattanDist(a.x, a.y, b.x, b.y);

  /**
   * @param {Map} cameFrom
   * @param {Point} current
   */
  const reconstructPath = (cameFrom, current) => {
    const path = [current];
    const keys = Array.from(cameFrom.keys());

    while (keys.includes(current)) {
      current = cameFrom.get(current);
      path.unshift(current);
    }

    return path;
  };

  // Constant movement cost
  const MOVE_COST = 1;

  const cameFrom = new Map();
  const costSoFar = new Map();

  /**
   * @param {Point} start
   * @param {Point} goal
   */
  return (start, goal) => {
    console.log(start, goal);

    const frontier = new PriorityQueue((a, b) => b.priority - a.priority);
    frontier.enq({ p: start, priority: 0 });

    cameFrom.clear();
    costSoFar.clear();

    cameFrom.set(start, null);
    costSoFar.set(start, 0);

    let iii = 0;
    while (!frontier.isEmpty() && iii < 20) {
      // console.log(iii++, frontier.size());

      const { p: current } = frontier.deq();

      if (isPosEqual(current, goal)) {
        // break;
        return reconstructPath(cameFrom, current);
      }

      const nb = neighbors(current);

      for (const next of nb) {
        const newCost = costSoFar.get(current) + MOVE_COST;

        if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
          costSoFar.set(next, newCost);
          const priority = newCost + heuristic(next, goal);
          frontier.enq({ p: next, priority });
          cameFrom.set(next, current);
        }
      }
    }

    // console.log([...cameFrom.entries()]);
    // console.log([...costSoFar.entries()]);
  };
}
