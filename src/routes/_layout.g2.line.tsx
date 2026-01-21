import { useRedis } from "@/hooks/use-redis";
import type { UiKline } from "@/types/Charts";
import { parseKlineData } from "@/utils/parse";
import { Stock } from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/g2/line")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "G2 Line",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: btc } = useRedis<any>("binance.BTCUSDT");

  const btcChartData = useMemo(() => {
    return parseKlineData(btc?.data);
  }, [btc]);

  const config = {
    data: btcChartData,
    xField: "start",
    yField: ["open", "close", "lowest", "highest"],
    colorField: "trend",
    scale: {
      color: {
        domain: ["up", "down"],
        range: ["#4daf4a", "#e41a1c"],
      },
      x: {
        compare: (a: number, b: number) => a - b,
      },
      y: {
        nice: true,
      },
    },
    line: {
      yField: "mean",
      colorField: "",
      style: {
        stroke: "#FACC14",
      },
    },
    axis: {
      x: {
        labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
      },
    },
    tooltip: {
      title: (d: UiKline) => dayjs(d.start).format("YYYY-MM-DD HH:mm"),
      items: [
        { field: "open" },
        { field: "close" },
        { field: "lowest" },
        { field: "highest" },
      ],
    },
  };
  return (
    <>
      <Stock {...config} />
      {/* <div>{JSON.stringify(btcChartData)}</div> */}
    </>
  );
}
