import { GushiCard } from "@/components/cards/gushi-card";
import { basicInfoMap } from "@/consts/gushitong";
import { useRedis } from "@/hooks/use-redis";
import type { ChartData } from "@/types/Charts";
import { parseMarketData } from "@/utils/parse";
import { mergeNonEmpty } from "@/utils/pick";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/candlestick/gushi")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "股市图表",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: au888 } = useRedis<any>("getstockquotation.AU888");
  const { data: ag888 } = useRedis<any>("getstockquotation.AG888");
  const { data: sz000001 } = useRedis<any>("getquotation.000001");
  const { data: ixic } = useRedis<any>("getquotation.IXIC");
  const { data: sh600519 } = useRedis<any>("getquotation.600519");
  const { data: usdcnh } = useRedis<any>("getquotation.USDCNH");

  const au888ChartData = useMemo<ChartData>(() => {
    if (!au888) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      au888?.data.newMarketData.marketData[0].p,
      au888?.data.newMarketData.keys,
    );
  }, [au888]);

  const usdcnhChartData = useMemo<ChartData>(() => {
    if (!usdcnh) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      usdcnh?.data.newMarketData.marketData[0].p,
      usdcnh?.data.newMarketData.keys,
    );
  }, [usdcnh]);

  const sh600519ChartData = useMemo<ChartData>(() => {
    if (!sh600519) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      sh600519?.data.newMarketData.marketData[0].p,
      sh600519?.data.newMarketData.keys,
    );
  }, [sh600519]);

  const ixicChartData = useMemo<ChartData>(() => {
    if (!ixic) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      ixic?.data.newMarketData.marketData[0].p,
      ixic?.data.newMarketData.keys,
    );
  }, [ixic]);

  const ag888ChartData = useMemo<ChartData>(() => {
    if (!ag888) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      ag888?.data.newMarketData.marketData[0].p,
      ag888?.data.newMarketData.keys,
    );
  }, [ag888]);

  const sh000001ChartData = useMemo<ChartData>(() => {
    if (!sz000001) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      sz000001?.data.newMarketData.marketData[0].p,
      sz000001?.data.newMarketData.keys,
    );
  }, [sz000001]);
  return (
    <div className="px-4 pb-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
      <GushiCard
        className="py-1 gap-1"
        basicInfo={mergeNonEmpty(au888?.data.cur ?? {}, {
          ...basicInfoMap["AU888"],
          timestamp: au888?.timestamp,
          tradeStatus: au888?.data.basicinfos?.tradeStatus,
        })}
        data={au888ChartData}
      />
      <GushiCard
        className="py-1 gap-1"
        basicInfo={mergeNonEmpty(sz000001?.data.cur ?? {}, {
          ...basicInfoMap["000001"],
          timestamp: sz000001?.timestamp,
          tradeStatus: sz000001?.data.basicinfos?.tradeStatus,
        })}
        data={sh000001ChartData}
      />
      <GushiCard
        className="py-1 gap-1"
        basicInfo={mergeNonEmpty(ag888?.data.cur ?? {}, {
          ...basicInfoMap["AG888"],
          timestamp: ag888?.timestamp,
          tradeStatus: ag888?.data.basicinfos?.tradeStatus,
        })}
        data={ag888ChartData}
      />
      <GushiCard
        className="py-1 gap-1"
        basicInfo={mergeNonEmpty(ixic?.data.cur ?? {}, {
          ...basicInfoMap["IXIC"],
          timestamp: ixic?.timestamp,
          tradeStatus: ixic?.data.basicinfos?.tradeStatus,
        })}
        data={ixicChartData}
      />
      <GushiCard
        className="py-1 gap-1"
        basicInfo={mergeNonEmpty(sh600519?.data.cur ?? {}, {
          ...basicInfoMap["600519"],
          timestamp: sh600519?.timestamp,
          tradeStatus: sh600519?.data.basicinfos?.tradeStatus,
        })}
        data={sh600519ChartData}
      />

      <GushiCard
        className="py-1 gap-1"
        basicInfo={mergeNonEmpty(usdcnh?.data.cur ?? {}, {
          ...basicInfoMap["USDCNH"],
          timestamp: usdcnh?.timestamp,
          tradeStatus: usdcnh?.data.basicinfos?.tradeStatus,
        })}
        data={usdcnhChartData}
      />
    </div>
  );
}
