import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { time } from "echarts";
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
 * Generate random data, not relevant to echarts API.
 */
function generateData() {
  var seriesData = [];
  var time = new Date("2024-04-09T09:30:00Z");
  var endTime = new Date("2024-04-09T15:00:00Z").getTime();
  var breakStart = new Date("2024-04-09T11:30:00Z").getTime();
  var breakEnd = new Date("2024-04-09T13:00:00Z").getTime();
  for (var val = 1669; time.getTime() <= endTime; ) {
    if (time.getTime() <= breakStart || time.getTime() >= breakEnd) {
      val =
        val +
        Math.floor((Math.random() - 0.5 * Math.sin(val / 1000)) * 20 * 100) /
          100;
      val = +val.toFixed(2);
      seriesData.push([time.getTime(), val]);
    }
    time.setMinutes(time.getMinutes() + 1);
  }
  return {
    seriesData: seriesData,
    breakStart: breakStart,
    breakEnd: breakEnd,
  };
}

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

function RouteComponent() {
  // {
  //   "formatTime": "14:57",
  //   "price": "1032.22",
  //   "time": "1768546655",
  //   "type": "1",
  //   "volume": "1"
  // },

  // const { data: au888 } = useRedis<any>("baidu.gushitong.opendata.AU888");
  var _data = generateData();

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
      show: true,
      trigger: "axis",
      formatter: (params: string | any[]) => {
        if (Array.isArray(params) && params.length > 0) {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${Number(param.value).toFixed(2)}`;
        }
        return "";
      },
    },
    xAxis: [
      {
        type: "time",
        interval: 1000 * 60 * 30,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value, _index, extra) => {
            if (!extra || !extra.break) {
              // The third parameter is `useUTC: true`.
              return time.format(value, "{HH}:{mm}", true);
            }
            // Only render the label on break start, but not on break end.
            if (extra.break.type === "start") {
              return (
                time.format(extra.break.start, "{HH}:{mm}", true) +
                "/" +
                time.format(extra.break.end, "{HH}:{mm}", true)
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
        breaks: [
          {
            start: _data.breakStart,
            end: _data.breakEnd,
            gap: 0,
          },
        ],
        breakArea: {
          expandOnClick: false,
          zigzagAmplitude: 0,
          zigzagZ: 200,
        },
      },
    ],
    yAxis: {
      type: "value",
      min: "dataMin",
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
      },
      {
        type: "slider",
        xAxisIndex: 0,
      },
    ],
    series: [
      {
        type: "line",
        symbolSize: 0,
        data: _data.seriesData,
      },
    ],
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
