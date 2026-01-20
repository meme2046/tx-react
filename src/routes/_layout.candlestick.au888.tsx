import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { time } from "echarts";
import { useMemo } from "react";
import type { ChartResult } from "@/types/Charts";
import { isNumber, isPlainObject } from "lodash";
import { formatNumberZh, parseMarketData } from "@/utils/parse";
import { VolPxChart } from "@/components/charts/vol-px-chart";
export const Route = createFileRoute("/_layout/candlestick/au888")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "沪金主连",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useRedis<any>("getstockquotation.AU888");

  const chartResult = useMemo<ChartResult>(() => {
    if (!data) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      data?.data.newMarketData.marketData[0].p,
      data?.data.newMarketData.keys,
    );
  }, [data]);
  return <VolPxChart data={chartResult} title="沪金主连" />;
}
