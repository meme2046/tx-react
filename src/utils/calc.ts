export function calculateYValue(
  currentY: number,
  min: number,
  max: number,
  y1: number,
  y2: number,
): number {
  // 计算屏幕范围
  const screenRange = y1 - y2;

  // 边界检查
  if (screenRange === 0) {
    return (min + max) / 2; // 避免除以零
  }

  // 计算比例
  const ratio = (y1 - currentY) / screenRange;

  // 计算数据范围
  const dataRange = max - min;

  // 计算对应的Y值
  const yValue = min + ratio * dataRange;

  return yValue;
}
