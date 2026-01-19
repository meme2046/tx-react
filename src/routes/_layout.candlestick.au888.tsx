import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { time } from "echarts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { BreakItem, PriceItem } from "@/types/Charts";
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
  const [priceData, setPriceData] = useState<PriceItem[]>([]);
  const [averageData, setAverageData] = useState<number[][]>([]);
  const [volumeData, setVolumeData] = useState<PriceItem[]>([]);
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [breaks, setBreaks] = useState<BreakItem[]>([]);

  const matrixMargin = 10;

  useEffect(() => {
    if (!au888) {
      return;
    }

    // 将 priceinfo 中的字符串数字字段转换为 number
    const priceinfo = au888?.data.priceinfo.map((item: any) => ({
      ...item,
      time: Number(`${item.time}000`),
      value: [Number(`${item.time}000`), Number(item.price)],
    }));

    setPriceData(priceinfo);
    setStartTime(priceinfo[0].time);
    setEndTime(priceinfo.at(-1).time);

    setAverageData(
      priceinfo.map((item: PriceItem) => [
        Number(`${item.time}`),
        Number(item.avgPrice),
      ]),
    );

    setVolumeData(
      priceinfo.map((item: PriceItem) => ({
        ...item,
        value: [item.time, Number(item.volume)],
      })),
    );

    // 正常情况下PriceItem中的time(unix时间戳的字符串形式)间隔为60s,如果大于60s，就是break,
    // 则记录下break的开始时间、结束时间、gap(时间间隔)
    const _breaks: BreakItem[] = [];
    for (let i = 0; i < priceinfo.length - 1; i++) {
      const item = priceinfo[i];
      const nextItem = priceinfo[i + 1];
      if (nextItem.time - item.time > 60 * 1000) {
        _breaks.push({
          start: item.time,
          end: nextItem.time,
          gap: 0,
        });
      }
    }
    setBreaks(_breaks);
  }, [au888]);

  // 使用 EChartsOption 类型确保配置项类型安全
  const option: EChartsOption = {
    titles: [
      {
        text: "价格",
        coordinateSystem: "matrix",
        coord: [0, 0],
      },
      {
        text: "成交量",
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
          const param = params[0];
          return `
          时间: ${param.data.datetime}<br/>
          ${param.seriesName}: ${Number(param.value[1]).toFixed(2)}<br/>
          涨跌额: ${param.data.increase}<br/>
          涨跌幅: ${param.data.ratio}<br/>
          均价: ${param.data.avgPrice}<br/>
          成交量: ${param.data.volume}手<br/>
          成交额: ${param.data.amount}<br/> 
          `;
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
        symbolSize: 0,
        data: priceData,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: "均价",
        type: "line",
        symbolSize: 0,
        data: averageData,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: "成交量",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData,
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
        show: true,
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
      <div>{JSON.stringify(breaks)}</div>
    </>
  );
}
