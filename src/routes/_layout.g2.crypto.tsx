import { KLineCardG2 } from "@/components/cards/kline-card-g2";
import { basicInfoMap } from "@/consts/charts";
import { useJson } from "@/hooks/use-json";
import { store } from "@/lib/valtio/store";
import { parseKlineData } from "@/utils/parse";
import { mergeNonEmpty } from "@/utils/pick";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSnapshot } from "valtio";

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

function RouteComponent() {
  const { qiniuBaseURL } = useSnapshot(store);

  const { data: xaut } = useJson<any>(
    `${qiniuBaseURL}/crypto/bitget.XAUTUSDT.json`,
  );
  const { data: bnLife } = useJson<any>(
    `${qiniuBaseURL}/crypto/binance.%E5%B8%81%E5%AE%89%E4%BA%BA%E7%94%9FUSDT.json`,
  );
  const { data: btc } = useJson<any>(
    `${qiniuBaseURL}/crypto/binance.BTCUSDT.json`,
  );
  const { data: eth } = useJson<any>(
    `${qiniuBaseURL}/crypto/bitget.ETHUSDT.json`,
  );

  const { parsedData: parsedDataXAUT, basic: basicXAUT } = useMemo(
    () => parseKlineData(xaut?.data),
    [xaut],
  );

  const { parsedData: parsedDataBTC, basic: basicBTC } = useMemo(
    () => parseKlineData(btc?.data),
    [btc],
  );

  const { parsedData: parsedDataBnLife, basic: basicBnLife } = useMemo(
    () => parseKlineData(bnLife?.data),
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
        basic={mergeNonEmpty(
          { ...basicXAUT, timestamp: xaut?.timestamp },
          basicInfoMap["XAUTUSDT"],
        )}
      />
      <KLineCardG2
        data={parsedDataBTC}
        basic={mergeNonEmpty(
          { ...basicBTC, timestamp: btc?.timestamp },
          basicInfoMap["BTCUSDT"],
        )}
      />
      <KLineCardG2
        data={parsedDataBnLife}
        basic={mergeNonEmpty(
          { ...basicBnLife, timestamp: bnLife?.timestamp },
          basicInfoMap["币安人生USDT"],
        )}
      />
      <KLineCardG2
        data={parsedDataETH}
        basic={mergeNonEmpty(
          { ...basicETH, timestamp: eth?.timestamp },
          basicInfoMap["ETHUSDT"],
        )}
      />
    </div>
  );
}
