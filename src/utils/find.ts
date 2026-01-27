// 引入 Lodash（浏览器环境：<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>）
import { isEmpty, sortedIndex, clamp } from "lodash";

/**
 * 从有序（从小到大）的 float 数组中，找到与目标值最接近的元素
 * @param sortedFloatArr 已按从小到大排序的 float 数组
 * @param target 目标值（number 类型）
 * @returns 数组中与目标值最接近的元素
 */
export function findClosestValue(
  sortedFloatArr: number[],
  target: number,
): number {
  // 边界处理：空数组直接抛出异常（根据业务需求可调整，如返回 undefined）
  if (isEmpty(sortedFloatArr)) {
    throw new Error("数组不能为空，请传入有效的 float 数组");
  }

  // 1. 用 _.sortedIndex 找到目标值的插入索引（二分查找，高效）
  const insertIndex = sortedIndex(sortedFloatArr, target);

  // 2. 确定需要对比的两个候选索引（处理边界：头部/尾部）
  // 候选1：插入索引的前一个元素（约束索引 >= 0）
  const candidateIndex1 = clamp(insertIndex - 1, 0, sortedFloatArr.length - 1);
  // 候选2：插入索引的当前元素（约束索引 <= 数组最后一位）
  const candidateIndex2 = clamp(insertIndex, 0, sortedFloatArr.length - 1);

  // 3. 获取两个候选元素
  const candidate1 = sortedFloatArr[candidateIndex1];
  const candidate2 = sortedFloatArr[candidateIndex2];

  // 4. 计算两个候选元素与目标值的差值（取绝对值，避免正负影响）
  const diff1 = Math.abs(candidate1 - target);
  const diff2 = Math.abs(candidate2 - target);

  // 5. 返回差值更小的那个元素（差值相等时，返回数组中靠前的元素，即 candidate1）
  return diff1 <= diff2 ? candidate1 : candidate2;
}
