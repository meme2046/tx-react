import { formatPrefix } from "d3-format";
import { replace, round } from "lodash";

// src.replace(/(\.\d*[1-9])0+$/, "$1").replace(/\.0+$/, "")

/**
 * 去掉数字字符串末尾无意义的 0
 * @param {string} src - 原始数字字符串，如 "123.45000" 或 "78.000"
 * @returns {string} 去掉尾部多余 0 后的字符串，如 "123.45" 或 "78"
 * @example
 * effective("123.45000") // "123.45"
 * effective("78.000")     // "78"
 * effective("120.0")      // "120"
 */
export function effective(src: string): string {
  return src.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");
}

/**
 * 格式化数字为带 k/M/B 单位的形式
 * @param {number} num - 要格式化的数字
 * @param {number} precision - 小数精度，默认1位
 * @returns {string} 格式化后的字符串
 */
export function formatNumberWithUnit(num: number, precision = 2) {
  // 获取d3默认的前缀格式化器
  const formatter = formatPrefix(`,.${precision}`, num);
  return effective(replace(formatter(num), "G", "B"));
}

/**
 * 数字格式化为万/亿单位
 * @param {number|string} num - 待转换的数字（支持数字或数字字符串）
 * @param {number} precision - 小数保留精度，默认2位（可根据需求调整）
 * @returns {string} 格式化后的带单位字符串
 */
export function formatNumberZh(num?: number, precision = 2) {
  if (num === undefined || isNaN(num)) {
    return "--";
  }
  // 2. 定义单位阈值和对应单位（万：10^4，亿：10^8）
  const thresholds = [
    { value: 1e8, unit: "亿" }, // 1亿 = 100000000
    { value: 1e4, unit: "万" }, // 1万 = 10000
  ];

  // 3. 匹配对应单位并格式化
  for (const { value, unit } of thresholds) {
    if (Math.abs(num) >= value) {
      // 使用 _.round 进行四舍五入，保证精度准确性
      const formattedNum = round(num / value, precision);
      // 处理小数末尾的0（可选，如 2891.30万 → 2891.3万）
      // const cleanNum = effective(formattedNum.toString());
      return `${formattedNum}${unit}`;
    }
  }

  // 4. 小于1万的数字，直接返回原始数字（保留指定精度）
  return round(num, precision).toString();
}
