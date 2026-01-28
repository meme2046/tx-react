import { KLineCardG2 } from "@/components/cards/kline-card-g2";
import { basicInfoMap } from "@/consts/charts";
import { useJson } from "@/hooks/use-json";
import { parseKlineData } from "@/utils/parse";
import { mergeNonEmpty } from "@/utils/pick";
import { createFileRoute } from "@tanstack/react-router";
import format from "pretty-format";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/g2/crypto")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "加密货币K线",
      },
    ],
  }),
});

const limit = 314;

function RouteComponent() {
  const { data: xaut } = useJson<any>(
    `https://api.bitget.com/api/v2/spot/market/candles?symbol=XAUTUSDT&granularity=5min&limit=${limit}`,
  );

  const { data: bnLife } = useJson<any>(
    `https://api4.binance.com/api/v3/uiKlines?symbol=币安人生USDT&interval=5m&limit=${limit}`,
  );

  const { data: btc } = useJson<any>(
    `https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=5m&limit=${limit}`,
  );

  const { data: eth } = useJson<any>(
    `https://api.bitget.com/api/v2/spot/market/candles?symbol=ETHUSDT&granularity=5min&limit=${limit}`,
  );

  const { parsedData: parsedDataXAUT, basic: basicXAUT } = useMemo(
    () => parseKlineData(xaut?.data),
    [xaut],
  );

  const { parsedData: parsedDataBTC, basic: basicBTC } = useMemo(
    () => parseKlineData(btc),
    [btc],
  );

  const { parsedData: parsedDataBnLife, basic: basicBnLife } = useMemo(
    () => parseKlineData(bnLife),
    [bnLife],
  );

  const { parsedData: parsedDataETH, basic: basicETH } = useMemo(
    () => parseKlineData(eth?.data),
    [eth],
  );

  return (
    <div className="px-4 pb-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
      <KLineCardG2
        data={parsedDataXAUT}
        basic={mergeNonEmpty(basicXAUT, basicInfoMap["XAUTUSDT"])}
      />
      <KLineCardG2
        data={parsedDataBTC}
        basic={mergeNonEmpty(basicBTC, basicInfoMap["BTCUSDT"])}
      />
      <KLineCardG2
        data={parsedDataBnLife}
        basic={mergeNonEmpty(basicBnLife, basicInfoMap["币安人生USDT"])}
      />
      <KLineCardG2
        data={parsedDataETH}
        basic={mergeNonEmpty(basicETH, basicInfoMap["ETHUSDT"])}
      />
    </div>
  );
}
