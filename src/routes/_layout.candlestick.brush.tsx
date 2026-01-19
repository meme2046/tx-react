import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { time } from "echarts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { BreakItem, PriceItem } from "@/types/Charts";
export const Route = createFileRoute("/_layout/candlestick/brush")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "brush",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: au888 } = useRedis<any>("getstockquotation.AU888");
  const [priceData, setPriceData] = useState<PriceItem[]>([]);
  const [averageData, setAverageData] = useState<number[][]>([]);
  const [volumeData, setVolumeData] = useState<number[][]>([]);
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
      time: Number(item.time),
      value: [Number(`${item.time}000`), Number(item.price)],
    }));

    setPriceData(priceinfo);
    setStartTime(priceinfo[0].time);
    setEndTime(priceinfo.at(-1).time);

    setAverageData(
      priceinfo.map((item: PriceItem) => [
        Number(`${item.time}000`),
        Number(item.avgPrice),
      ]),
    );

    setVolumeData(
      priceinfo.map((item: PriceItem) => [
        Number(`${item.time}000`),
        Number(item.volume),
      ]),
    );

    // 正常情况下PriceItem中的time(unix时间戳的字符串形式)间隔为60s,如果大于60s，就是break,
    // 则记录下break的开始时间、结束时间、gap(时间间隔)
    const _breaks: BreakItem[] = [];
    for (let i = 0; i < priceinfo.length - 1; i++) {
      const item = priceinfo[i];
      const nextItem = priceinfo[i + 1];
      if (nextItem.time - item.time > 60) {
        _breaks.push({
          breakStart: item.time * 1000,
          breakEnd: nextItem.time * 1000,
          gap: 0,
        });
      }
    }
    setBreaks(_breaks);
  }, [au888]);

  // 使用 EChartsOption 类型确保配置项类型安全
  const option: EChartsOption = {
    title: {
      text: "brush",
      left: "center",
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "cross",
        snap: true,
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
      label: {
        backgroundColor: "#777",
      },
    },
    xAxis: [
      {
        show: true,
        type: "time",
        gridIndex: 0,
        interval: 1000 * 60,
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
        breakLabelLayout: {
          // Disable auto move of break labels if overlapping,
          // and use `axisLabel.formatter` to control the label display.
          moveOverlap: false,
        },
        breaks: breaks,
        breakArea: {
          expandOnClick: false,
          zigzagAmplitude: 0,
          zigzagZ: 200,
        },
      },
      {
        type: "time",
        gridIndex: 1,
        show: false,
        breaks: breaks,
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
      },
      {
        type: "value",
        gridIndex: 1,
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
      x: {
        show: false,
        data: Array(1).fill(null),
      },
      y: {
        show: false,
        data: Array(10).fill(null),
      },
      body: {
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
        left: "6%",
        right: "6%",
        height: "50%",
      },
      {
        left: "6%",
        right: "6%",
        top: "63%",
        height: "16%",
      },
    ],
  };

  return (
    <>
      <div className="w-full h-120">
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
