import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";

export const Route = createFileRoute("/_layout/candlestick/single")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "k线图 single",
      },
    ],
  }),
});

/**
 * 生成日内两个交易时段的时间点（字符串格式 HH:mm）
 * - 上午: 09:30 到 11:30（每5分钟一个点，共24个）
 * - 下午: 13:00 到 15:00（每5分钟一个点，共24个）
 */
const generateTimePoints = (): string[] => {
  const times: string[] = [];

  const addMinutes = (
    startHour: number,
    startMin: number,
    count: number,
  ): void => {
    for (let i = 0; i < count; i++) {
      const totalMinutes = startHour * 60 + startMin + i * 5;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  };

  addMinutes(9, 30, 24); // 09:30 ～ 11:30
  addMinutes(13, 0, 24); // 13:00 ～ 15:00

  return times;
};

/**
 * 生成模拟价格数据（围绕基准值波动，带简单趋势）
 */
const generatePriceData = (length: number): number[] => {
  const base = 3000;
  const data: number[] = [];
  let lastValue = base;

  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5) * 20; // 小幅随机波动
    lastValue += change;
    data.push(parseFloat(lastValue.toFixed(2)));
  }

  return data;
};
function RouteComponent() {
  const timeData = generateTimePoints();
  console.log(timeData);
  const priceData = generatePriceData(timeData.length);
  console.log(priceData);

  // 使用 EChartsOption 类型确保配置项类型安全
  const option: EChartsOption = {
    title: {
      text: "日内断点图(Intraday Breaks)",
      left: "center",
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: string | any[]) => {
        if (Array.isArray(params) && params.length > 0) {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${Number(param.value).toFixed(2)}`;
        }
        return "";
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: timeData,
      axisLabel: {
        rotate: 45,
        fontSize: 10,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#eee",
        },
      },
    },
    yAxis: {
      type: "value",
      scale: true,
      splitLine: {
        show: true,
        lineStyle: {
          color: "#eee",
        },
      },
    },
    series: [
      {
        name: "价格",
        type: "line",
        smooth: true,
        symbol: "none",
        data: priceData,
        lineStyle: {
          width: 2,
          color: "#ec4f4f",
        },
        areaStyle: {
          color: "rgba(236, 79, 79, 0.1)",
        },
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      top: "15%",
      containLabel: true,
    },
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
