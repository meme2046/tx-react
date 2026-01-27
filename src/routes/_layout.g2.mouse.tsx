import Crosshair from "@/components/Crosshair";
import { useJson } from "@/hooks/use-json";
import { parseKlineData } from "@/utils/parse";
import { calculateYValue } from "@/utils/calc";
import {
  Base,
  type Chart,
  type CommonConfig,
  type PlotEvent,
} from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, type RefObject } from "react";
import dayjs from "dayjs";
import type { UiKline } from "@/types/Charts";
import { getPanel } from "@/utils/panel";
import { minBy, maxBy, round, get } from "lodash";

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

  const config: CommonConfig = useMemo(
    () => ({
      type: "view",
      data: parsedData,
      encode: { x: "start", y: ["lowest", "highest"] },
      scale: {
        start: {
          type: "time",
        },
        y: {
          type: "linear",
        },
        x: {
          compare: (a: number, b: number) => a - b,
        },
      },
      style: {
        // 自己的样式
        // stroke: "red",
        // strokeWidth: 2,
        // viewFill: "red",
        // viewFillOpacity: 0.3,
        // contentFill: "cyan",
        // contentFillOpacity: 0.3,
      },
      axis: {
        x: {
          title: false,
          grid: false,
          line: true,
          labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
        },
        y: {
          title: false,
          grid: false,
          line: true,
          tick: true, // 是否显示刻度
          tickCount: 10, // 设置推荐生成的刻度数量
          labelAutoHide: false,
          labelLineWidth: 0,
          labelLineHeight: 0,
          tickMethod: (start: number, end: number, count: number) => {
            const step = (end - start) / (count - 1);
            return Array.from({ length: count }, (_, i) =>
              round(start + i * step, 2),
            );
          },
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
    }),
    [parsedData],
  );

  function onReady({ chart }: { chart: Chart }) {
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

    chart.on(`plot:pointermove`, (event: PlotEvent) => {
      const { nativeEvent, x, y } = event;
      if (!nativeEvent || !x || !y) return; // 过滤程序触发的事件

      const { canvas } = chart.getContext();
      const { document } = canvas;

      const yLineEle = document.getElementsByClassName("g2-axis-line");

      if (yLineEle.length === 0) return;

      const yLine = yLineEle.slice(-1).map((item: any) => item.__data__.line);

      const [[x1, y1], [_x2, y2]] = yLine[0];

      const panel = getPanel({
        container,
        id: "plot-pointermove",
        width: "auto",
        pos: "left",
      });

      if (x <= x1 || y > y1 || y < y2) {
        // 鼠标不在范围内
        panel.style.display = "none";
        return;
      } else {
        panel.style.display = "";
      }

      const estimatedCount = 12; // 预估y轴刻度最大数量
      const yTicksEle = document.getElementsByClassName("g2-axis-tick");

      if (yTicksEle.length === 0) return;

      const yTicks = yTicksEle
        .slice(-estimatedCount)
        .map((item: any) => item.__data__)
        .filter((item: any) => Number(item.id) < estimatedCount);

      const min = Number(get(minBy(yTicks, "value"), "label"));
      const max = Number(get(maxBy(yTicks, "value"), "label"));

      const yValue = calculateYValue(y, min, max, y1, y2);

      // const pointData = chart.getDataByXY({ x, y });
      // const firstPointData =
      //   pointData && pointData.length > 0 ? pointData[0] : null;

      // <div>🔢容器坐标: (${round(x)}, ${round(y)})</div>
      // <div>事件类型: ${event.type}</div>
      // <div>xValue: ${firstPointData && dayjs(firstPointData.start).format("YYYY-MM-DD HH:mm")}</div>

      // 调用平滑更新方法
      panel.updateY(y);
      panel.innerHTML = `
              <div>${round(yValue, 2)}</div>
            `;
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <Crosshair
        containerRef={containerRef as RefObject<HTMLElement>}
        xLeftPadding={72}
        xRightPadding={16}
        yTopPadding={16}
        yBottomPadding={88}
      />
      <Base {...config} onReady={onReady}></Base>
    </div>
  );
}
