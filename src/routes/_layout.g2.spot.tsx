import { useJson } from "@/hooks/use-json";
import type { UiKline } from "@/types/Charts";
import { parseKlineData } from "@/utils/parse";
import {
  Base,
  type Chart,
  type CommonConfig,
  type PlotEvent,
} from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo, useRef } from "react";

export const Route = createFileRoute("/_layout/g2/spot")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Chart Spot",
      },
    ],
  }),
});

function RouteComponent() {
  const ref1 = useRef<Chart>(null);
  const ref2 = useRef<Chart>(null);

  const { data } = useJson(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=15m&limit=200",
  );

  const parsedData = useMemo(() => parseKlineData(data), [data]);

  const colors = ["#00C9C9", "#7863FF", "#1783FF", "#F0884D", "#D580FF"];
  const grMap = {
    up: "#4DAF4A",
    down: "#E41A1C",
  };

  const config1: CommonConfig = {
    type: "view",
    data: parsedData,
    paddingLeft: 64,
    marginBottom: 0,
    height: 280,
    encode: {
      x: "start",
    },
    axis: {
      x: false,
      // x: {
      //   labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
      // },
    },
    slider: {
      x: {
        style: {
          // showHandle: false,
          // selectionSize: 0,
          // trackSize: 0,
          // handleSize: 0,
          // sparklineSize: 0,
        },
        labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      },
    },
    children: [
      {
        type: "link",
        encode: {
          y: ["lowest", "highest"],
        },
        style: {
          stroke: (d: UiKline) => grMap[d.trend], // 设置连接线颜色
        },
      },
      {
        type: "interval",
        encode: {
          y: ["open", "close"],
        },
        style: {
          fill: (d: UiKline) => grMap[d.trend],
        },
        tooltip: {
          items: [
            { field: "open", name: "开盘价" },
            { field: "close", name: "收盘价" },
            { field: "lowest", name: "最低价" },
            { field: "highest", name: "最高价" },
          ],
        },
      },
      {
        type: "line",
        encode: {
          y: "sma7",
          color: colors[1],
        },
        tooltip: {
          items: [{ field: "sma7", name: "SMA7" }],
        },
      },
      {
        type: "line",
        encode: {
          y: "sma25",
          color: colors[2],
        },
        tooltip: {
          items: [{ field: "sma25", name: "SMA25" }],
        },
      },
      {
        type: "line",
        encode: {
          y: "ema12",
          color: colors[3],
        },
        tooltip: {
          items: [{ field: "ema12", name: "EMA12" }],
        },
      },
      {
        type: "line",
        encode: {
          y: "ema26",
          color: colors[4],
        },
        tooltip: {
          items: [{ field: "ema26", name: "EMA26" }],
        },
      },
    ],
    onReady: ({ chart }) => {
      ref1.current = chart;
      chart.on("sliderX:filter", (e: PlotEvent) => {
        const { nativeEvent, data } = e;
        if (!nativeEvent) return;
        const { selection } = data;
        ref2.current?.emit("sliderX:filter", { data: { selection } });
      });
    },
  };
  const config2: CommonConfig = {
    type: "view",
    data: parsedData,
    paddingLeft: 64,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBotton: 0,
    height: 160,
    encode: {
      x: "start",
    },
    axis: {
      x: {
        title: false,
        labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
      },
    },
    slider: {
      x: {
        style: { showHandle: false, trackSize: 0 },
        labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      },
    },
    children: [
      {
        type: "interval",
        encode: {
          y: ["volume"],
        },
        style: {
          fill: (d: UiKline) => grMap[d.trend],
        },
      },
    ],
    onReady: ({ chart }) => {
      ref2.current = chart;
      chart.on("sliderX:filter", (e: PlotEvent) => {
        const { nativeEvent, data } = e;
        if (!nativeEvent) return;
        const { selection } = data;
        ref1.current?.emit("sliderX:filter", { data: { selection } });
      });
    },
  };

  return (
    <div className="chart-container">
      <Base {...config1} className="w-full" />
      <Base {...config2} className="w-full" />
    </div>
  );
}
