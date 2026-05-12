export const snapToGrid = (value: number, gridSize: number): number => {
  if (gridSize <= 0) return value;
  const snapped = Math.round(value / gridSize) * gridSize;
  return snapped === 0 ? 0 : snapped;
};
