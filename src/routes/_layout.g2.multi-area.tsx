import {
  Base,
  type Chart,
  type PlotEvent,
  type CommonConfig,
} from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/_layout/g2/multi-area")({
  component: RouteComponent,
});

function RouteComponent() {
  const ref1 = useRef<Chart>(null);
  const ref2 = useRef<Chart>(null);

  const config1: CommonConfig = {
    type: "view",
    height: 360,
    data: {
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/bmw-prod/551d80c6-a6be-4f3c-a82a-abd739e12977.csv",
    },
    encode: {
      x: "date",
    },
    children: [
      {
        type: "area",
        encode: {
          x: "date",
          y: "close",
        },
        animate: false,
        interaction: {
          brushXFilter: true,
          tooltip: false,
        },
      },
    ],
  };

  const config2: CommonConfig = {
    type: "view",
    height: 180,
    data: {
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/bmw-prod/551d80c6-a6be-4f3c-a82a-abd739e12977.csv",
    },
    encode: {
      x: "date",
    },
    children: [
      {
        type: "area",

        encode: {
          x: "date",
          y: "close",
        },
        animate: false,
        interaction: {
          brushXHighlight: {
            series: true,
            maskOpacity: 0.3,
            maskFill: "#777",
            maskHandleEFill: "#D3D8E0",
            maskHandleWFill: "#D3D8E0",
          },
          tooltip: false,
        },
      },
    ],
    onReady: ({ chart }) => {
      ref2.current = chart;
      chart.on("brush:highlight", (e: PlotEvent) => {
        const { nativeEvent, data } = e;
        if (!nativeEvent) return;
        const { selection } = data;
        ref1.current?.emit("brush:filter", { data: { selection } });
      });
      chart.on("brush:remove", (e: PlotEvent) => {
        const { nativeEvent } = e;
        if (!nativeEvent) return;
        const { x: scaleX, y: scaleY } = chart.getScale();
        const selection = [
          scaleX.getOptions().domain,
          scaleY.getOptions().domain,
        ];
        ref1.current?.emit("brush:filter", { data: { selection } });
      });
    },
  };

  return (
    <>
      <Base {...config1} className="w-full" />
      <Base {...config2} className="w-full" />
    </>
  );
}
