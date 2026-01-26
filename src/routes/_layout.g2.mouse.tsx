import Crosshair from "@/components/Crosshair";
import { useJson } from "@/hooks/use-json";
import { parseKlineData } from "@/utils/parse";
import {
  Base,
  ChartEvent,
  type CommonConfig,
  type PlotEvent,
} from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type RefObject } from "react";
import dayjs from "dayjs";
import format, { format as prettyFormat } from "pretty-format"; // ES2015 modules
import type { UiKline } from "@/types/Charts";
import { getPanel } from "@/utils/panel";
import { round } from "lodash";
import { tooltip } from "@antv/g2/lib/interaction/tooltip";

export const Route = createFileRoute("/_layout/g2/mouse")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Mouse",
      },
    ],
  }),
});

function RouteComponent() {
  const colors = ["#00C9C9", "#7863FF", "#1783FF", "#F0884D", "#D580FF"];
  const grMap = {
    up: "#4DAF4A",
    down: "#E41A1C",
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useJson(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=15m&limit=200",
  );

  const parsedData = useMemo(() => parseKlineData(data), [data]);
  const config: CommonConfig = {
    type: "view",
    data: parsedData,
    encode: { x: "start", y: ["lowest", "highest"] },
    style: {
      // 自己的样式
      stroke: "red",
      strokeWidth: 2,
      viewFill: "red",
      viewFillOpacity: 0.3,
      contentFill: "cyan",
      contentFillOpacity: 0.3,
    },
    axis: {
      x: {
        title: false,
        line: true,
        labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
      },
      y: {
        title: false,
        line: true,
        nice: true,
      },
    },
    slider: {
      x: {
        labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      },
    },
    interaction: {
      tooltip: false,
      // tooltip: {
      //   title: (d: UiKline) => dayjs(d.start).format("YYYY-MM-DD HH:mm"),
      // },
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
      },
      {
        type: "line",
        encode: {
          y: "sma7",
          color: colors[1],
        },
      },
      {
        type: "line",
        encode: {
          y: "sma25",
          color: colors[2],
        },
      },
      {
        type: "line",
        encode: {
          y: "ema12",
          color: colors[3],
        },
      },
      {
        type: "line",
        encode: {
          y: "ema26",
          color: colors[4],
        },
      },
    ],
    onReady: ({ chart }) => {
      const container = chart.getContainer(); // 获取图表容器 DOM
      chart.on("afterrender", (_event: PlotEvent) => {
        if (container) {
          // 监听鼠标在容器内移动
          container.addEventListener("mousemove", (e: MouseEvent) => {
            const panel = getPanel({
              container,
              id: "mousemove",
              width: "220px",
              pos: "right",
            });
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            panel.innerHTML = `
              <div>🧱容器尺寸: ${container.offsetWidth} ✘ ${container.offsetHeight}</div>
              <div>容器位置: ${rect.left}, ${rect.top}</div>
              <div>坐标: (${e.clientX}, ${e.clientY})</div>
              <div>🔢容器坐标: (${x}, ${y})</div>
              <div>事件类型: ${e.type}</div>
            `;
          });
        }
      });

      // 监听tooltip显示事件
      chart.on(`plot:pointermove`, (event: PlotEvent) => {
        const { nativeEvent, x, y } = event;
        if (!nativeEvent) return; // 过滤程序触发的事件
        // console.log("🚀event", event);
        const panel = getPanel({
          container,
          id: "plot-pointermove",
          width: "320px",
          pos: "left",
        });

        // const yScale = chart.getScaleByChannel("y");
        const coordOptions = chart.getCoordinate().getOptions();
        const {
          innerWidth: plotWidth, // 绘图区真实宽度（核心）
          innerHeight: plotHeight, // 绘图区真实高度（核心）
          paddingLeft, // 绘图区左偏移
          marginLeft, // 绘图区左外边距
          paddingTop, // 绘图区上偏移
          marginTop, // 绘图区上外边距
          paddingBottom, // 无需用到，因为 y 轴是从 top 开始计算
          marginBottom, // 绘图区下外边距
          paddingRight, // 绘图区右偏移
          marginRight, // 绘图区右外边距
        } = coordOptions;

        const plotMouseX = x - paddingLeft - marginLeft;
        const plotMouseY = y - paddingTop - marginTop;

        // ✘ 鼠标移出绘图区域
        if (
          plotMouseX < 0 ||
          plotMouseX > plotWidth ||
          plotMouseY < 0 ||
          plotMouseY > plotHeight
        ) {
          return;
        }

        // 转为 Scale 所需的 0~1 相对占比（基于真实绘图区尺寸）
        const yRatio = plotMouseY / plotHeight;
        const yScale = chart.getScaleByChannel("y");
        const domain = yScale.getOptions().domain;

        let originalYValue = yScale.invert(yRatio);

        const pointData = chart.getDataByXY({ x, y });
        const firstPointData =
          pointData && pointData.length > 0 ? pointData[0] : null;

        panel.innerHTML = `
              <div>🔢容器坐标: (${round(x)}, ${round(y)})</div>
              <div>事件类型: ${event.type}</div>
              <div>xValue: ${dayjs(firstPointData.start).format("YYYY-MM-DD HH:mm")}</div>
              <div>yValue: ${originalYValue}</div>
              <div>yDomain: [${domain}]</div>
              <div>left: [${paddingLeft},${marginLeft}]</div>
              <div>top: [${paddingTop},${marginTop}]</div>
              <div>right: [${paddingRight},${marginRight}]</div>
              <div>bottom: [${paddingBottom},${marginBottom}]</div>
            `;
      });
    },
  };
  return (
    <div ref={containerRef} className="relative">
      <Crosshair
        containerRef={containerRef as RefObject<HTMLElement>}
        color="var(--color-primary)"
      />
      <Base {...config}></Base>
    </div>
  );
}
