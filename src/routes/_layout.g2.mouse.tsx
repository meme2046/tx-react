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
import { useMemo, useRef, type RefObject } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useJson(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=15m&limit=200",
  );

  const parsedData = useMemo(() => parseKlineData(data), [data]);
  const config: CommonConfig = {
    type: "view",
    data: parsedData,
    encode: { x: "start", y: "volume" },
    tooltip: {
      items: [{ channel: "y", valueFormatter: ".0%" }],
    },
    children: [
      {
        type: "interval",
        encode: { y: "volume", color: "trend" },
        viewStyle: {
          viewFill: "blue",
          viewFillOpacity: 0.3,
        },
      },
    ],
    onReady: ({ chart }) => {
      let containerMouseEntered = false;
      chart.on("afterrender", (_e: PlotEvent) => {
        const container = chart.getContainer(); // 获取图表容器 DOM
        // const coordinate = chart.getCoordinate(); // 获取坐标系实例

        // 创建状态显示面板
        const statusPanel = document.createElement("div");
        statusPanel.id = "mouse-status-panel";
        statusPanel.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 12px;
          line-height: 1.4;
          z-index: 1000;
          min-width: 220px;
        `;

        // 更新状态显示
        const updateStatus = (
          isInside: boolean,
          eventInfo: {
            type?: string;
            clientX?: number;
            clientY?: number;
            yValue?: string;
          } = {},
        ) => {
          const status = isInside ? "✅ 鼠标在容器内" : "❌ 鼠标在容器外";
          const containerRect = container.getBoundingClientRect();

          statusPanel.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 8px;">${status}</div>
          <div>容器尺寸: ${container.offsetWidth} ✘ ${container.offsetHeight}</div>
          <div>容器位置: (${Math.round(containerRect.left)}, ${Math.round(
            containerRect.top,
          )})</div>
          ${
            eventInfo.clientX !== undefined
              ? `<div>鼠标坐标: (${eventInfo.clientX}, ${eventInfo.clientY})</div>`
              : ""
          }
          ${eventInfo.type ? `<div>事件类型: ${eventInfo.type}</div>` : ""}
          ${eventInfo.yValue ? `<div>y值: ${eventInfo.yValue}</div>` : ""}
          <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
            移动鼠标到图表上试试看！
          </div>
        `;
        };
        if (container) {
          // 将状态面板添加到容器的父元素
          container.parentElement.style.position = "relative";
          container.parentElement.appendChild(statusPanel);

          // 初始化显示
          updateStatus(false);

          // 监听鼠标进入容器
          container.addEventListener("mouseenter", (e: MouseEvent) => {
            containerMouseEntered = true;
            updateStatus(true, {
              type: e.type,
              clientX: e.clientX,
              clientY: e.clientY,
            });
          });

          // 监听鼠标在容器内移动
          container.addEventListener("mousemove", (e: MouseEvent) => {
            if (containerMouseEntered) {
              // 获取鼠标位置相对于容器的坐标
              const rect = container.getBoundingClientRect();
              const _x = e.clientX - rect.left;
              const _y = e.clientY - rect.top;

              updateStatus(true, {
                type: e.type,
                clientX: e.clientX,
                clientY: e.clientY,
              });
            }
          });

          // 监听鼠标离开容器
          container.addEventListener("mouseleave", (e: MouseEvent) => {
            if (containerMouseEntered) {
              containerMouseEntered = false;
              updateStatus(false, {
                type: e.type,
                clientX: e.clientX,
                clientY: e.clientY,
              });
            }
          });
        }
      });

      // 监听tooltip显示事件
      chart.on("tooltip:show", (event: PlotEvent) => {
        const yScale = chart.getScaleByChannel("y");

        if (yScale && event.canvas && event.viewport) {
          // 尝试使用viewport坐标，考虑图表y轴倒置的情况
          try {
            // 获取图表的高度，用于调整y坐标
            const chartHeight = chart.getContainer().offsetHeight;

            // 直接使用viewport.y，归一化到[0, 1]范围
            const normalizedY = event.viewport.y / chartHeight;

            // 使用归一化后的y坐标获取y轴值
            const yValue = yScale.invert(normalizedY);
            console.log("Y轴值 (adjusted):", yValue);
            console.log("Canvas y:", event.canvas.y);
            console.log("Viewport y:", event.viewport.y);
            console.log("Chart height:", chartHeight);
            console.log("Normalized y:", normalizedY);

            // 检查比例尺的范围
            const domain = yScale.getOptions().domain;
            const range = yScale.getOptions().range;
            console.log("Y轴定义域:", domain);
            console.log("Y轴值域:", range);
          } catch (error) {
            console.error("Error getting adjusted y value:", error);
          }
        }
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
