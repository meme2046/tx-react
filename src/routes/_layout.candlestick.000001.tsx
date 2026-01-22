import { VolPxECharts } from "@/components/charts/vol-px-echarts";
import { useRedis } from "@/hooks/use-redis";
import type { ChartData } from "@/types/Charts";
import { parseMarketData } from "@/utils/parse";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/candlestick/000001")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "上证指数",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useRedis<any>("getquotation.000001");

  const chartResult = useMemo<ChartData>(() => {
    if (!data) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      data?.data.newMarketData.marketData[0].p,
      data?.data.newMarketData.keys,
    );
  }, [data]);
  return <VolPxECharts data={chartResult} title="上证指数" />;
}
