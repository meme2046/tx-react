import { Chart } from "@/hooks/g2/charts";
import { useG2 } from "@/hooks/g2/use-g2";
import { useJson } from "@/hooks/use-json";
import type { UiKline } from "@/types/Charts";
import { parseKlineData } from "@/utils/parse";
import type { G2Spec } from "@antv/g2";
import { arrowPoints } from "@antv/g2/lib/shape/utils";
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
  const grMap = {
    up: "#4DAF4A",
    down: "#E41A1C",
  };
  const options: G2Spec = {
    type: "view",
    autoFit: true,
    data: parsedData,
    paddingLeft: 36,
    encode: {
      x: "start",
    },
    scale: {
      x: {
        compare: (a: number, b: number) => a - b,
      },
    },
    axis: {
      x: {
        title: false,
        labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
      },
      y: {
        title: false,
      },
    },
    slider: {
      x: {
        labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      },
    },
    interaction: {
      tooltip: {
        crosshairs: true,
        crosshairsXStroke: colors[0],
        crosshairsYStroke: colors[1],
        shared: true,
        groupName: false,
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
        tooltip: {
          title: "",
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
          title: (d: any) => dayjs(d.start).format("YYYY-MM-DD HH:mm"),
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
          title: "",
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
          title: "",
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
          title: "",
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
          title: "",
          items: [{ field: "ema26", name: "EMA26" }],
        },
      },
    ],
  };

  return <Chart options={options} className="w-full h-160" />;
  // return <div className="w-full h-160" ref={ref} />;
}
