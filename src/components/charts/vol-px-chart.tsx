import type { ChartData } from "@/types/Charts";
import { formatNumberZh } from "@/utils/parse";
import { time } from "echarts";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { isPlainObject } from "lodash";
import { useRef } from "react";
interface Props {
  title?: string;
  className?: string;
  matrixMargin?: number;
  data: ChartData;
}
const defaultProps = {
  title: "",
  className: "w-full h-64",
  matrixMargin: 10,
};
export function VolPxChart(props: Props) {
  const { title, className, data, matrixMargin } = {
    ...defaultProps,
    ...props,
  };
  const { marketData, volData, breaks, avgData } = data;
  const titles = [
    {
      text: title,
      coordinateSystem: "matrix",
      coord: [0, 0],
    },
    volData && {
      text: "成交量",
      left: 36,
      textStyle: {
        fontSize: 12,
      },
      coordinateSystem: "matrix",
      coord: [0, 7],
    },
  ];

  const tooltip = {
    show: true,
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
    formatter: (params: string | any[]) => {
      if (Array.isArray(params) && params.length > 0) {
        const param =
          params.find((item: any) => isPlainObject(item.data)) || params[0];

        let tooltipContent = `
          时间: ${param.data.time}<br/>
          价格：${param.data.price}<br/>
          涨跌额: ${param.data.range}<br/>
          涨跌幅: ${param.data.ratio}<br/>
          `;

        if (param.data.avgPrice) {
          tooltipContent += `均价: ${param.data.avgPrice}<br/>`;
        }

        tooltipContent += `
          成交量: ${isNaN(param.data.volume) ? "--" : formatNumberZh(param.data.volume) + "股"}<br/>
          成交额: ${formatNumberZh(param.data.amount)}<br/> 
          `;

        return tooltipContent;
      }
      return "";
    },
  };

  const series = [
    {
      name: "价格",
      type: "line",
      showSymbol: false,
      symbolSize: 4,
      data: marketData,
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    avgData && {
      name: "均价",
      type: "line",
      showSymbol: false,
      symbolSize: 4,
      data: avgData,
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    volData && {
      name: "成交量",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: volData,
    },
  ];

  const option: EChartsOption = {
    title: titles,
    tooltip: tooltip,
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
    },
    dataZoom: [
      marketData.length > 1 && {
        type: "slider",
        xAxisIndex: [0, 1], // 同时作用于第 0 和第 1 个 x 轴
      },
    ],
    matrix: {
      left: matrixMargin,
      right: matrixMargin,
      top: matrixMargin,
      bottom: matrixMargin,
      backgroundStyle: {
        borderWidth: 0,
      },
      x: {
        show: false,
        data: Array(1).fill(null),
      },
      y: {
        show: false,
        data: Array(10).fill(null),
        levelSize: 36,
      },
      body: {
        itemStyle: {
          borderWidth: 0,
        },
        data: [
          {
            coord: [
              [0, 0],
              [0, 6],
            ],
            mergeCells: true,
          },
          {
            coord: [
              [0, 0],
              [7, 8],
            ],
            mergeCells: true,
          },
        ],
      },
    },
    grid: [
      {
        coordinateSystem: "matrix", // 指定该网格使用矩阵坐标系，而非默认的笛卡尔坐标系
        coord: [0, 0],
        top: 0,
        bottom: 0,
        left: 36,
        right: 48,
      },
      {
        coordinateSystem: "matrix",
        coord: [0, 7],
        top: 0,
        bottom: 0,
        left: 36,
        right: 48,
      },
    ],
    xAxis: [
      {
        show: true,
        type: "time",
        gridIndex: 0,
        interval: 1000 * 60,
        axisLine: {
          show: true, // 隐藏轴线
        },
        axisTick: {
          show: true, // 隐藏刻度
        },
        splitLine: {
          show: false, // 隐藏分割线
        },
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value: number, _index: number, extra?: any) => {
            // console.log("value", value);
            if (!extra || !extra.break) {
              // The third parameter is `useUTC: true`.
              return time.format(value, "{HH}:{mm}", false);
            }
            // Only render the label on break start, but not on break end.
            if (extra.break.type === "start") {
              return (
                time.format(extra.break.start, "{HH}:{mm}", false) +
                "/" +
                time.format(extra.break.end, "{HH}:{mm}", false)
              );
            }
            return "";
          },
        },
        breaks: breaks,
        breakLabelLayout: {
          moveOverlap: false, // 控制当断点标签发生重叠时，是否自动移动标签以避免重叠
        },
        breakArea: {
          expandOnClick: false,
          itemStyle: {
            borderColor: "orange",
          },
        },
      },
      {
        show: true,
        type: "time",
        gridIndex: 1,
        interval: 1000 * 60,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true, // 隐藏轴线
        },
        axisTick: {
          show: false, // 隐藏刻度
        },
        breaks: breaks,
        breakLabelLayout: {
          moveOverlap: false, // 控制当断点标签发生重叠时，是否自动移动标签以避免重叠
        },
        breakArea: {
          expandOnClick: false,
          itemStyle: {
            borderColor: "orange",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        gridIndex: 0,
        min: "dataMin",
        axisLabel: {
          inside: true, // 将刻度标签显示在轴线内侧
        },
        axisLine: {
          show: false, // 隐藏轴线
        },
        axisTick: {
          show: true, // 隐藏刻度
        },
        splitLine: {
          show: false, // 隐藏分割线
        },
      },
      {
        type: "value",
        gridIndex: 1,
        max: "dataMax",
        show: false,
      },
    ],
    series: series,
  };

  const chartRef = useRef<ReactECharts>(null);

  if (data.marketData.length === 0) {
    return <p>Loading chart...</p>;
  }

  return (
    <div className={className}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge={true}
        lazyUpdate={true}
        autoResize={true}
        // onChartReady={this.onChartReadyCallback}
        // onEvents={EventsDict}
      />
    </div>
  );
}
