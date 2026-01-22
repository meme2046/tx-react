import { useG2 } from "@/hooks/g2/use-g2";
import { useJson } from "@/hooks/use-json";
import type { G2Spec } from "@antv/g2";
import { createFileRoute } from "@tanstack/react-router";

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
    "https://gw.alipayobjects.com/os/antvdemo/assets/data/candle-sticks.json",
  );

  const kChartOptions: G2Spec = {
    type: "view",
    autoFit: true,
    data: data || [],
    children: [
      {
        type: "link",
        encode: {
          x: "time",
          y: ["min", "max"],
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
        tooltip: {
          title: "time",
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
          x: "time",
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
          title: "time",
          items: [
            { field: "start", name: "开盘价" },
            { field: "end", name: "收盘价" },
            { field: "min", name: "最低价" },
            { field: "max", name: "最高价" },
          ],
        },
      },
    ],
  };

  const columnChartOptions: G2Spec = {
    type: "view",
    autoFit: true,
    data: data || [],
    children: [
      {
        type: "interval",
        encode: {
          x: "time",
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
    </>
  );
}
