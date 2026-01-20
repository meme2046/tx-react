import type { BreakItem, ChartData, MarketData } from "@/types/Charts";
import { round } from "lodash";

export function parseMarketData(
  p: string,
  keys: Array<keyof MarketData>,
): ChartData {
  const marketData = p.split(";").map((record) => {
    const values = record.split(",");
    if (values.length !== keys.length) {
      throw new Error(
        `✘ Invalid record format: expected ${keys.length} values, got ${values.length}`,
      );
    }

    const obj: Partial<MarketData> = {};
    keys.forEach((key, index) => {
      if (key === "timestamp") {
        obj[key] = Number(`${values[index]}000`);
      } else if (
        key === "volume" ||
        key === "price" ||
        key === "avgPrice" ||
        key == "amount"
      ) {
        obj[key] = Number(values[index]);
      } else if (key !== "value") {
        obj[key] = values[index];
      }
    });
    obj.value = [obj.timestamp!, obj.price!];

    return obj as MarketData;
  });

  // 构建 volData
  const volData = marketData.map((item) => [item.timestamp!, item.volume!]);

  const breaks: BreakItem[] = [];
  for (let i = 0; i < marketData.length - 1; i++) {
    const item = marketData[i];
    const nextItem = marketData[i + 1];
    if (nextItem.timestamp - item.timestamp > 60 * 1000) {
      breaks.push({
        start: item.timestamp,
        end: nextItem.timestamp - 60 * 1000,
        gap: 0,
      });
    }
  }

  // 检查是否所有记录都有 avgPrice
  const hasAvgPrice =
    marketData.length > 0 && marketData[0].avgPrice !== undefined;

  let avgData: number[][] | undefined;
  if (hasAvgPrice) {
    avgData = marketData.map((item) => [item.timestamp!, item.avgPrice!]);
  }

  return {
    marketData,
    volData,
    breaks,
    avgData,
  };
}

/**
 * 数字格式化为万/亿单位
 * @param {number|string} num - 待转换的数字（支持数字或数字字符串）
 * @param {number} precision - 小数保留精度，默认2位（可根据需求调整）
 * @returns {string} 格式化后的带单位字符串
 */
export function formatNumberZh(num: number, precision = 2) {
  if (isNaN(num)) {
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
      const cleanNum =
        formattedNum % 1 === 0
          ? formattedNum
          : formattedNum.toString().replace(/\.?0*$/, "");
      return `${cleanNum}${unit}`;
    }
  }

  // 4. 小于1万的数字，直接返回原始数字（保留指定精度）
  return round(num, precision).toString();
}
