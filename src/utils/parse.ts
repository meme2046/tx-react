import type { BreakItem, MarketData } from "@/types/Charts";

export interface ParseResult {
  marketData: MarketData[];
  volData: number[][];
  breaks: BreakItem[];
  avgData?: number[][];
}

export function parseMarketData(
  p: string,
  keys: Array<keyof MarketData>,
): ParseResult {
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
      } else if (key === "volume" || key === "price" || key === "avgPrice") {
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
