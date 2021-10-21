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
