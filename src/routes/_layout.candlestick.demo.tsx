import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { time } from "echarts";
import { useEffect, useState } from "react";
import type { VolPxItem } from "@/types/Charts";

export const Route = createFileRoute("/_layout/candlestick/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: au888 } = useRedis<any>("getstockquotation.AU888");
  const [priceData, setPriceData] = useState<VolPxItem[]>([]);
  const [volumeData, setVolumeData] = useState<VolPxItem[]>([]);
  const [breaks, setBreaks] = useState<any[]>([]);

  useEffect(() => {
    if (!au888?.data?.priceinfo) {
      return;
    }

    // Process price data
    const priceinfo = au888.data.priceinfo.map((item: any) => ({
      ...item,
      time: Number(`${item.time}000`),
      value: [Number(`${item.time}000`), Number(item.price)],
    }));

    setPriceData(priceinfo);

    // Process volume data
    setVolumeData(
      priceinfo.map((item: VolPxItem) => ({
        ...item,
        value: [item.time, Number(item.volume)],
      })),
    );

    // Calculate breaks (time gaps > 60s)
    const _breaks: any[] = [];
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

  const option: EChartsOption = {
    title: {
      text: "共享X轴演示",
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
      },
    },
    // Link all x-axes for synchronization
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
    },
    xAxis: [
      {
        type: "time",
        show: true,
        gridIndex: 0,
        interval: 1000 * 60,
        axisLine: {
          show: false, // 隐藏轴线
        },
        axisTick: {
          show: false, // 隐藏刻度
        },
        splitLine: {
          // show: false, // 隐藏分割线
        },
        axisLabel: {
          show: true,
          formatter: (value: number, _index: number, extra?: any) => {
            if (!extra || !extra.break) {
              return time.format(value, "{HH}:{mm}", false);
            }
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
          moveOverlap: false,
        },
        breakArea: {
          expandOnClick: false,
        },
        breaks: breaks,
      },
      {
        type: "time",
        show: true,
        gridIndex: 1,
        interval: 1000 * 60,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        breakLabelLayout: {
          moveOverlap: false,
        },
        breakArea: {
          expandOnClick: false,
        },
        breaks: breaks,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "价格",
        gridIndex: 0,
        min: "dataMin",
        axisLabel: {
          inside: true, // 将刻度标签显示在轴线内侧
        },
      },
      {
        type: "value",
        show: false,
        name: "成交量",
        gridIndex: 1,
        min: "dataMin",
      },
    ],
    // Data zoom affects both x-axes
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
      },
      {
        type: "slider",
        xAxisIndex: [0, 1],
      },
    ],
    grid: [
      {
        left: "4%",
        right: "4%",
        top: 0,
        bottom: "30%",
      },
      {
        left: "4%",
        right: "4%",
        top: "70%",
        bottom: "10%",
      },
    ],
    series: [
      {
        name: "价格",
        type: "line",
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize: 0,
        data: priceData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: "#5470c6",
        },
      },
      {
        name: "成交量",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData,
        itemStyle: {
          color: "#91cc75",
        },
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
