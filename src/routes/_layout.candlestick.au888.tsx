import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { time } from "echarts";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { BreakItem, VolPxItem } from "@/types/Charts";
import { isNumber, isPlainObject, size } from "lodash";
import { parseMarketData, type ParseResult } from "@/utils/parse";
export const Route = createFileRoute("/_layout/candlestick/au888")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "沪金主连",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: au888 } = useRedis<any>("getstockquotation.AU888");
  // const [priceData, setPriceData] = useState<VolPxItem[]>([]);
  // const [averageData, setAverageData] = useState<number[][]>([]);
  // const [volumeData, setVolumeData] = useState<VolPxItem[]>([]);
  // const [startTime, setStartTime] = useState<number>();
  // const [endTime, setEndTime] = useState<number>();
  // const [breaks, setBreaks] = useState<BreakItem[]>([]);

  const matrixMargin = 10;

  const { marketData, volData, breaks, avgData } = useMemo<ParseResult>(() => {
    if (!au888) {
      return { marketData: [], volData: [], breaks: [], avgData: undefined };
    }
    return parseMarketData(
      au888?.data.newMarketData.marketData[0].p,
      au888?.data.newMarketData.keys,
    );
  }, [au888]);

  // 使用 EChartsOption 类型确保配置项类型安全
  const option: EChartsOption = {
    title: [
      {
        text: "沪金主连",
        coordinateSystem: "matrix",
        coord: [0, 0],
      },
      {
        text: "成交量",
        left: 36,
        textStyle: {
          fontSize: 12,
        },
        coordinateSystem: "matrix",
        coord: [0, 7],
      },
    ],
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: (params: string | any[]) => {
        console.log("params", params);
        if (Array.isArray(params) && params.length > 0) {
          // 找到第一个 data 为对象的项作为 param
          const param =
            params.find((item: any) => isPlainObject(item.data)) || params[0];

          let tooltipContent = `
          时间: ${param.data.time}<br/>
          ${param.seriesName}: ${Number(param.value[1])}<br/>
          涨跌额: ${param.data.range}<br/>
          涨跌幅: ${param.data.ratio}<br/>
          `;

          // 只有当 avgPrice 存在时才显示均价行
          if (isNumber(param.data.avgPrice)) {
            tooltipContent += `均价: ${param.data.avgPrice}<br/>`;
          }

          tooltipContent += `
          成交量: ${param.data.volume}手<br/>
          成交额: ${param.data.amount}<br/> 
          `;

          return tooltipContent;
        }
        return "";
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
    },
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
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1], // 同时作用于第 0 和第 1 个 x 轴
      },
      {
        type: "slider",
        xAxisIndex: [0, 1], // 同时作用于第 0 和第 1 个 x 轴
      },
    ],
    series: [
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
      {
        name: "成交量",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volData,
      },
    ],
    matrix: {
      left: matrixMargin,
      right: matrixMargin,
      top: matrixMargin,
      bottom: matrixMargin,
      backgroundStyle: {
        borderWidth: 0,
        borderType: "dashed",
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
  };

  return (
    <>
      <div className="w-full h-96">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
      <div>{JSON.stringify(marketData)}</div>
    </>
  );
}
