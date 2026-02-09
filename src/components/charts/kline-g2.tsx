import {
  Base,
  type Chart,
  type CommonConfig,
  type PlotEvent,
} from "@ant-design/charts";
import { useRef, type RefObject } from "react";
import Crosshair from "../Crosshair";
import type { UiKline } from "@/types/Charts";
import dayjs from "dayjs";
import { get, round, slice, values } from "lodash";
import { chartColors } from "@/consts/colors";
import { calculateYValue } from "@/utils/calc";
import { isMobile } from "react-device-detect";
import { storePersist } from "@/lib/valtio/storePersist";
import { useSnapshot } from "valtio";
interface Props {
  className?: string;
  data?: UiKline[];
  precision?: number;
  yTickCount?: number;
}

export function KLineG2({
  className = "relative h-full w-full",
  data = [],
  precision = 2,
  yTickCount = 10, //y轴刻度数量
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const yPxTooltipRef = useRef<HTMLDivElement>(null);
  const { theme } = useSnapshot(storePersist);

  const config: CommonConfig = {
    theme: { type: theme },
    type: "view",
    data,
    encode: { x: "start" },
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
      color: {
        type: "ordinal",
        domain: ["SMA7", "SMA25", "EMA12", "EMA26", "UP", "DOWN", "收盘价"],
        range: values(chartColors.slice(0, 7)),
      },
    },
    legend: {},
    axis: {
      x: {
        title: false,
        grid: false,
        labelFormatter: (d: number) => dayjs(d).format("HH:mm"),
        line: true,
        tick: true, // 是否显示刻度
        labelAutoHide: {
          keepHeader: true, // 保留第一个刻度值
          keepTail: true, // 保留最后一个刻度值
        },
      },
      y: {
        title: false,
        grid: true,
        line: true,
        tick: true, // 是否显示刻度
        tickCount: yTickCount, // 设置推荐生成的刻度数量
        tickMethod: (start: number, end: number, count: number) => {
          const step = (end - start) / (count - 1);
          return Array.from({ length: count }, (_, i) =>
            round(start + i * step, precision),
          );
        },
      },
    },
    slider: {
      x: {
        labelFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      },
    },
    children: [
      {
        type: "line",
        encode: {
          y: ["close"],
          color: () => "收盘价",
        },
        style: {
          lineWidth: 0,
        },
        tooltip: {
          title: {
            field: "start",
            valueFormatter: (d: number) => dayjs(d).format("YYYY-MM-DD HH:mm"),
          },
        },
        interaction: {
          tooltip: {
            shared: true,
            leading: true,
            trailing: true,
            crosshairsY: isMobile,
          },
        },
      },
      {
        type: "link",
        encode: {
          y: ["lowest", "highest"],
          color: "trend",
        },
        tooltip: false,
      },
      {
        type: "interval",
        encode: {
          y: ["open", "close"],
          color: "trend",
        },
        tooltip: false,
      },
      {
        type: "line",
        encode: {
          y: "sma7",
          color: () => "SMA7",
        },
        tooltip: false,
      },
      {
        type: "line",
        encode: {
          y: "sma25",
          color: () => "SMA25",
        },
        tooltip: false,
      },
      {
        type: "line",
        encode: {
          y: "ema12",
          color: () => "EMA12",
        },
        tooltip: false,
      },
      {
        type: "line",
        encode: {
          y: "ema26",
          color: () => "EMA26",
        },
        tooltip: false,
      },
    ],
  };

  // 添加平滑更新方法
  const updateYPxTooltip = (y: number, yValue: number) => {
    if (!yPxTooltipRef.current) return;

    const tooltip = yPxTooltipRef.current as any;

    tooltip.innerHTML = `
      <div>${round(yValue, precision)}</div>
    `;

    if (!tooltip.isAnimating) {
      tooltip.isAnimating = true;

      requestAnimationFrame(() => {
        tooltip.style.transform = `translateY(calc(-50% + ${y}px))`;
        tooltip.isAnimating = false;
      });
    }
  };

  function onReady({ chart }: { chart: Chart }) {
    chart.on(`tooltip:show`, (event: PlotEvent) => {
      const { nativeEvent } = event;
      const { x, y } = event.viewport;
      if (!nativeEvent || !x || !y || !yPxTooltipRef.current) return; // 过滤程序触发的事件

      const { canvas } = chart.getContext();
      const { document } = canvas;

      const yLineEle = document.getElementsByClassName("g2-axis-line");
      if (yLineEle.length === 0) return;
      const xLine = yLineEle.slice(-2).map((item: any) => item.__data__.line);
      const yLine = yLineEle.slice(-1).map((item: any) => item.__data__.line);
      const [[_x1, _y1], [x2, _y2]] = xLine[0];
      const [[x1, y1], [_x2, y2]] = yLine[0];

      if (x <= x1 || x >= x2 || y > y1 || y < y2) {
        yPxTooltipRef.current.style.opacity = "0";
        return;
      } else {
        yPxTooltipRef.current.style.opacity = "1";
      }

      const yTicksEle = document.getElementsByClassName("g2-axis-tick");
      if (yTicksEle.length === 0) return;

      const yTicks = slice(yTicksEle, -yTickCount)
        .map((item: any) => item.__data__)
        .filter((item: any) => Number(item.id) < yTickCount);

      const min = Number(get(yTicks.at(0), "label"));
      const max = Number(get(yTicks.at(-1), "label"));

      const yValue = calculateYValue(y, min, max, y1, y2);

      // 更新 yPxTooltip 位置
      updateYPxTooltip(y, yValue);
    });

    chart.on(`plot:pointerleave`, (_event: PlotEvent) => {
      if (!yPxTooltipRef.current) return;
      yPxTooltipRef.current.style.opacity = "0";
    });
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        ref={yPxTooltipRef}
        id="y-px-tooltip"
        className="absolute left-3 p-1 rounded z-50 text-primary bg-accent/60 transition-[transform,opacity] duration-[100ms,400ms] ease-[ease-out,ease-in-out]"
      ></div>
      {!isMobile && (
        <Crosshair
          containerRef={containerRef as RefObject<HTMLElement>}
          xLeftPadding={64}
          xRightPadding={12}
          yTopPadding={12}
          yBottomPadding={80}
        />
      )}
      <Base {...config} onReady={onReady}></Base>
    </div>
  );
}
