import { useG2 } from "@/hooks/g2/use-g2";
import { useJson } from "@/hooks/use-json";
import { parseKlineData } from "@/utils/parse";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/g2/candle-sticks")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Candle Sticks",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useJson<any>(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=15m&limit=100",
  );

  const parsedData = useMemo(() => parseKlineData(data), [data]);

  const kChartOptions: G2Spec = {
    type: "view",
    autoFit: true,
    data: parsedData,
    children: [
      {
        type: "link",
        encode: {
          x: "start",
          y: ["min", "max"],
          color: (d: any) => {
            const trend = Math.sign(d.open - d.close);
            return trend > 0 ? "下跌" : trend === 0 ? "不变" : "上涨";
          },
        },
        scale: {
          x: {
            compare: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
          },
          color: {
            domain: ["下跌", "不变", "上涨"],
            range: ["#4daf4a", "#999999", "#e41a1c"],
          },
        },
        tooltip: {
          title: "start",
          items: [
            { field: "start", name: "开盘价" },
            { field: "end", name: "收盘价" },
            { field: "min", name: "最低价" },
            { field: "max", name: "最高价" },
          ],
        },
      },
      {
        type: "interval",
        encode: {
          x: "start",
          y: ["start", "end"],
          color: (d: any) => {
            const trend = Math.sign(d.start - d.end);
            return trend > 0 ? "下跌" : trend === 0 ? "不变" : "上涨";
          },
        },
        scale: {
          x: {
            compare: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
          },
          color: {
            domain: ["下跌", "不变", "上涨"],
            range: ["#4daf4a", "#999999", "#e41a1c"],
          },
        },
        style: {
          fillOpacity: 1,
          stroke: (d: any) => {
            if (d.start === d.end) return "#999999";
          },
        },
        axis: {
          x: {
            title: false,
          },
          y: {
            title: false,
          },
        },
        tooltip: {
          title: "start",
          items: [
            { field: "start", name: "开盘价" },
            { field: "end", name: "收盘价" },
            { field: "min", name: "最低价" },
            { field: "max", name: "最高价" },
          ],
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "sma7",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "sma25",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "ema12",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "ema26",
        },
      },
    ],
  };

  const columnChartOptions: G2Spec = {
    type: "view",
    autoFit: true,
    data: parsedData,
    children: [
      {
        type: "interval",
        encode: {
          x: "start",
          y: "volumn",
          color: (d: any) => {
            const trend = Math.sign(d.start - d.end);
            return trend > 0 ? "下跌" : trend === 0 ? "不变" : "上涨";
          },
        },
        scale: {
          x: {
            compare: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
          },
          color: {
            domain: ["下跌", "不变", "上涨"],
            range: ["#4daf4a", "#999999", "#e41a1c"],
          },
        },
        axis: {
          x: false,
          y: {
            title: false,
          },
        },
      },
    ],
  };

  const { ref: kChartRef, chart: kChart } = useG2({
    options: kChartOptions,
  });

  const { ref: columnChartRef, chart: columnChart } = useG2({
    options: columnChartOptions,
  });

  // 同步图例交互
  kChart?.on("legend:filter", (e) => {
    const { nativeEvent, data } = e;
    if (!nativeEvent) return;
    columnChart?.emit("legend:filter", { data });
  });

  kChart?.on("legend:reset", (e) => {
    const { nativeEvent, data } = e;
    if (!nativeEvent) return;
    columnChart?.emit("legend:reset", { data });
  });

  return (
    <>
      <div className="w-full h-96" ref={kChartRef} />
      <div className="w-full h-56" ref={columnChartRef} />
      <div>{JSON.stringify(parsedData)}</div>
    </>
  );
}
