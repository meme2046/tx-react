import { useJson } from "@/hooks/use-json";
import type { UiKline } from "@/types/Charts";
import { parseKlineData } from "@/utils/parse";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Base, type Chart } from "@ant-design/charts";
import type { G2Spec } from "@antv/g2";

export const Route = createFileRoute("/_layout/g2/tooltip")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Tooltip",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useJson(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=15m&limit=200",
  );

  const parsedData = useMemo(() => parseKlineData(data), [data]);
  const colors = ["#00C9C9", "#7863FF", "#1783FF", "#F0884D", "#D580FF"];
  const grMap = {
    up: "#4DAF4A",
    down: "#E41A1C",
  };
  const config: G2Spec = {
    type: "spaceFlex",
    direction: "col",
    ratio: [1, 1],
    data: parsedData,
    paddingLeft: 64,
    encode: {
      x: "start",
    },
    sync: {
      x: true, // 共享X轴
    },
    children: [
      {
        type: "view",
        encode: {
          x: "start",
        },
        axis: {
          x: {
            labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
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
      },
      {
        type: "view",
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
            // labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
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
      },
    ],
  };

  function onReady({ chart }: { chart: Chart }) {
    chart.on("brush:filter", (e: any) => {
      console.log(e);
    });
  }

  return (
    <>
      <Base {...config} className="w-1/2 bg-amber-400" onReady={onReady} />
    </>
  );
}
