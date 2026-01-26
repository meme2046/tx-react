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

function getStatusPanel(container: HTMLElement) {
  if (!container) return null;
  container.style.position = "relative";
  const div = document.createElement("div");
  div.id = "point-data";
  div.style.position = "absolute";
  div.style.left = `10px`;
  div.style.top = `10px`;
  div.style.padding = "12px";
  div.style.borderRadius = "4px";
  div.style.backgroundColor = "#eee";
  container.insertBefore(div, container.firstChild);
  return div;
}

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
    encode: { x: "start", y: "mean" },
    axis: {
      x: {
        title: false,
        line: true,
        labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
      },
      y: {
        title: false,
        line: true,
      },
    },
    slider: {
      x: {
        labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      },
    },
    interaction: {
      tooltip: false,
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
          width: "220px",
          pos: "left",
        });

        // const yScale = chart.getScaleByChannel("y");
        const coordOptions = chart.getCoordinate().getOptions();
        const {
          innerWidth: plotWidth, // 绘图区真实宽度（核心）
          innerHeight: plotHeight, // 绘图区真实高度（核心）
          paddingLeft, // 绘图区左偏移
          paddingTop, // 绘图区上偏移
          // paddingBottom, // 无需用到，因为 y 轴是从 top 开始计算
        } = coordOptions;

        const plotMouseX = x - paddingLeft;
        const plotMouseY = y - paddingTop;

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
        const xRatio = plotMouseX / plotWidth;
        const yRatio = plotMouseY / plotHeight;

        const xScale = chart.getScaleByChannel("x");
        const yScale = chart.getScaleByChannel("y");
        const domain = yScale.getOptions().domain;

        let originalXValue = xScale.invert(xRatio);
        let originalYValue = yScale.invert(yRatio);

        panel.innerHTML = `
              <div>🔢容器坐标: (${round(x)}, ${round(y)})</div>
              <div>事件类型: ${event.type}</div>
              <div>xValue: ${originalXValue}</div>
              <div>yValue: ${originalYValue}</div>
              <div>yDomain: ${domain}</div>
            `;
      });
    },
  };
  return (
    <div ref={containerRef} className="relative mx-10">
      <Crosshair
        containerRef={containerRef as RefObject<HTMLElement>}
        color="var(--color-primary)"
      />
      <Base {...config}></Base>
    </div>
  );
}
