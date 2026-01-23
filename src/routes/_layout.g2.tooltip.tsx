import { useG2 } from "@/hooks/g2/use-g2";
import { useJson } from "@/hooks/use-json";
import type { UiKline } from "@/types/Charts";
import { parseKlineData } from "@/utils/parse";
import type { G2Spec } from "@antv/g2";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/g2/tooltip")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useJson(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=1m&limit=200",
  );

  const parsedData = useMemo(() => parseKlineData(data), [data]);
  const colors = ["#00C9C9", "#7863FF", "#1783FF", "#F0884D", "#D580FF"];
  const colorMap = {
    up: "#4daf4a",
    down: "#e41a1c",
  };
  const options: G2Spec = {
    type: "view",
    autoFit: true,
    data: {
      value: parsedData,
    },
    children: [
      {
        type: "link",
        encode: {
          x: "start",
          y: ["lowest", "highest"],
        },
        style: {
          stroke: (d: UiKline) => colorMap[d.trend], // 设置连接线颜色
        },
      },
      {
        type: "interval",
        encode: {
          x: "start",
          y: ["open", "close"],
        },
        style: {
          fill: (d: UiKline) => colorMap[d.trend],
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "mean",
          color: "#00C9C9",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "sma7",
          color: "#7863FF",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "sma25",
          color: "#1783FF",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "ema12",
          color: "#F0884D",
        },
      },
      {
        type: "line",
        encode: {
          x: "start",
          y: "ema26",
          color: "#D580FF",
        },
      },
    ],
    interaction: {
      tooltip: {
        crosshairs: true,
        crosshairsXStroke: "#00C9C9",
        crosshairsYStroke: "#7863FF",
      },
    },
  };

  const { ref } = useG2({ options });
  return <div className="w-full h-160" ref={ref} />;
}
