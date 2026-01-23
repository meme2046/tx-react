import type { BreakItem, ChartData, MarketData, UiKline } from "@/types/Charts";
import { has, includes, isNull, round, toNumber } from "lodash";
import { MACD, SMA, EMA } from "trading-signals";
export function parseMarketData(
  p: string,
  keys: Array<keyof MarketData>,
  isOz: boolean = false, // 是否盎司计价
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
        key === "amount" ||
        key === "range"
      ) {
        if (isOz && includes(["price", "avgPrice", "range"], key)) {
          obj[key] = round(Number(values[index]) / 31.1034768, 2);
        } else {
          obj[key] = Number(values[index]);
        }
      } else if (key !== "value") {
        obj[key] = values[index];
      }
    });
    obj.value = [obj.timestamp!, obj.price!];

    return obj as MarketData;
  });

  let volData: number[][] | undefined;
  if (has(marketData[0], "volume")) {
    volData = marketData.map((item) => [item.timestamp!, item.volume!]);
  }

  const breaks: BreakItem[] = [];
  for (let i = 0; i < marketData.length - 1; i++) {
    const item = marketData[i];
    const nextItem = marketData[i + 1];
    if (nextItem.timestamp - item.timestamp > 60 * 1000) {
      breaks.push({
        start: item.timestamp,
        end: nextItem.timestamp,
        gap: 0,
      });
    }
  }

  let avgData: number[][] | undefined;
  if (has(marketData[0], "avgPrice")) {
    avgData = marketData.map((item) => [item.timestamp!, item.avgPrice!]);
  }

  return {
    marketData,
    volData,
    breaks,
    avgData,
  };
}

export function parseKlineData(data: any, precision: number = 2): UiKline[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  const sma7 = new SMA(7);
  const sma25 = new SMA(25);
  const ema12 = new EMA(12);
  const ema26 = new EMA(26);

  // 1. 解析原始数据
  const parsedData: UiKline[] = data.map((item) => {
    const start = toNumber(item[0]);
    const open = toNumber(item[1]);
    const highest = toNumber(item[2]);
    const lowest = toNumber(item[3]);
    const close = toNumber(item[4]);
    const volume = toNumber(item[5]);
    const amount = toNumber(item[7]);

    sma7.add(close);
    sma25.add(close);
    ema12.add(close);
    ema26.add(close);
    const sma7Result = sma7.getResult();
    const sma25Result = sma25.getResult();
    const ema12Result = ema12.getResult();
    const ema26Result = ema26.getResult();

    return {
      start, // k线开盘时间
      open, // 开盘价
      highest, // 最高价
      lowest, // 最低价
      mean: round((highest + lowest) / 2, precision), // 均价
      close, // 收盘价(当前K线未结束的即为最新价)
      volume, // 成交量
      end: item[6], // k线收盘时间
      amount, // 成交额
      trades: item[8], // 成交笔数
      buyVolume: item[9], // 主动买入成交量
      buyAmount: item[10], // 主动买入成交额
      trend: close - open >= 0 ? "up" : "down",
      sma7: sma7Result ? round(sma7Result, precision) : null,
      sma25: sma25Result ? round(sma25Result, precision) : null,
      ema12: ema12Result ? round(ema12Result, precision) : null,
      ema26: ema26Result ? round(ema26Result, precision) : null,
    };
  });

  return parsedData.slice(25);
}
