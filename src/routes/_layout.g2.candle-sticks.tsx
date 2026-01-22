import { useG2 } from "@/hooks/g2/use-g2";
import type { G2Spec } from "@antv/g2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/g2/candle-sticks")({
  component: RouteComponent,
});

function RouteComponent() {
  const options: G2Spec = {
    type: "interval",
    autoFit: true,
    data: {
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/antvdemo/assets/data/candle-sticks.json",
    },
    encode: {
      x: "time",
      y: "volumn",
      color: (d: any) => {
        const trend = Math.sign(d.start - d.end);
        return trend > 0 ? "下跌" : trend === 0 ? "不变" : "上涨";
      },
    },
    scale: {
      x: { compare: (a, b) => new Date(a).getTime() - new Date(b).getTime() },
      color: {
        domain: ["下跌", "不变", "上涨"],
        range: ["#4daf4a", "#999999", "#e41a1c"],
      },
    },
    axis: { x: false, y: { title: false } },
  };
  const ref = useG2({
    options: options,
  });
  return <div className="w-full h-96" ref={ref} />;
}
