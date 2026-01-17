import { useRedis } from "@/hooks/use-redis";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
export const Route = createFileRoute("/_layout/candlestick/matrix-stock")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "股市矩阵图",
      },
    ],
  }),
});

const lastClose = 50; // Close value of yesterday
const colorGreen = "#47b262";
const colorRed = "#eb5454";
const colorGray = "#888";
const colorGreenOpacity = "rgba(71, 178, 98, 0.2)";
const colorRedOpacity = "rgba(235, 84, 84, 0.2)";
const matrixMargin = 10;

const getPriceColor = (price: number) => {
  return price === lastClose
    ? colorGray
    : price > lastClose
      ? colorRed
      : colorGreen;
};
const priceFormatter = (value: number) => {
  const result = Math.round(value * 100) / 100 + "";
  // Adding padding 0 if needed
  let dotIndex = result.indexOf(".");
  if (dotIndex < 0) {
    return result + ".00";
  } else if (dotIndex === result.length - 2) {
    return result + "0";
  }
  return result;
};

const sTime = new Date("2025-10-16 09:30:00").getTime();
const eTime = new Date("2025-10-16 15:00:00").getTime();
const breakStartTime = new Date("2025-10-16 11:30:00").getTime();
const breakEndTime = new Date("2025-10-16 13:00:00").getTime();

// 价格和成交量数据生成,每分钟随机生成一个价格和成交量
let price = 0;
let sumPrice = 0;
let time = sTime;
let sumVolume = 0;
let maxAbs = 0;
let direction = 1; // 1 for up, -1 for down
const priceData: number[][] = []; // 价格数据，每分钟一个价格 [time,price]
const volumeData: number[][] = []; // 成交量数据，每分钟一个成交量 [time,volume]
const averageData: number[][] = []; // 价格加权成交量数据，每分钟一个价格 [time,price]
while (time < eTime) {
  const volume = Math.random() * 1000 + 500; // 随机成交量，范围500-1500
  volumeData.push([time, volume]);
  sumVolume += volume;
  if (time === sTime) {
    // Today open price
    direction = Math.random() < 0.5 ? 1 : -1; // 开盘1(上涨方向)/-1(下跌方向)
    price = lastClose * (1 + (Math.random() - 0.5) * 0.02);
  } else {
    // 70% chance to maintain the last direction
    direction = Math.random() < 0.8 ? direction : -direction;
    price = Math.round((price + direction * (Math.random() * 0.1)) * 100) / 100;
  }
  priceData.push([time, price]);
  sumPrice += price * volume;
  averageData.push([time, sumPrice / sumVolume]);
  maxAbs = Math.max(maxAbs, Math.abs(price - lastClose));
  if (time === breakStartTime) {
    time = breakEndTime;
  } else {
    time += 60 * 1000; // increment by 1 minute
  }
}
const orderData: {
  value: number;
  itemStyle: { color: string };
  label: {
    formatter: string;
    rich: any;
  };
}[] = []; // 订单数据
const orderCat: number[] = []; // 订单价格分类，用于绘制订单柱状图
const orderCount = 10;
let orderPrice = price - (0.01 * orderCount) / 2;
for (let i = 0; i < orderCount; ++i) {
  if (price === orderPrice) {
    continue;
  }
  orderPrice += 0.01;
  orderCat.push(orderPrice);
  const amount = Math.round(Math.random() * 200) + 10;
  const isLower = orderPrice < price;
  orderData.push({
    value: amount,
    itemStyle: {
      color: isLower ? colorGreenOpacity : colorRedOpacity,
    },
    label: {
      formatter:
        `{name|${isLower ? "Bid" : "Ask"}} ` +
        `{${isLower ? "green" : "red"}|${priceFormatter(orderPrice)}} ` +
        `{amount|(${amount})}`,
      rich: {
        red: {
          color: colorRed,
        },
        green: {
          color: colorGreen,
        },
        amount: {
          color: "#666",
        },
        name: {
          fontWeight: "bold",
          color: "#444",
        },
      },
    },
  });
}

const getTitle = (text: string, subtext: string, coord: number[]) => {
  return {
    text: text,
    subtext: subtext,
    left: 2,
    top: 2,
    padding: 0,
    textStyle: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#444",
    },
    subtextStyle: {
      fontSize: 10,
      color: "#666",
    },
    itemGap: 0,
    coordinateSystem: "matrix",
    coord: coord,
  };
};

const titles = [
  getTitle("Volume", Math.round(sumVolume / 1000) + "B", [0, 4]),
  getTitle("Order Book", "", [4, 0]),
];

function RouteComponent() {
  const chartRef = useRef(null);
  const [matrixWidth, setMatrixWidth] = useState(0);
  const [matrixHeight, setMatrixHeight] = useState(0);
  useEffect(() => {
    if (chartRef.current) {
      const myChart = (chartRef.current as any).getEchartsInstance();
      if (myChart) {
        setMatrixWidth(myChart.getWidth() - matrixMargin * 2);
        setMatrixHeight(myChart.getHeight() - matrixMargin * 2);
        console.log(matrixWidth, matrixHeight);
      }
    }
  }, [chartRef.current]);
  // 使用 EChartsOption 类型确保配置项类型安全
  const option: EChartsOption = {
    title: titles,
    xAxis: [
      {
        type: "time",
        gridIndex: 0,
        show: true,
        breaks: [
          {
            start: breakStartTime,
            end: breakEndTime,
            gap: 0,
          },
        ],
      },
      {
        type: "time",
        gridIndex: 1,
        show: true,
        breaks: [
          {
            start: breakStartTime,
            end: breakEndTime,
            gap: 0,
          },
        ],
      },
      {
        type: "value",
        gridIndex: 2,
        show: false, // 如果为true,由于订单簿的 x 轴类型是 value ，ECharts 会自动生成网格线，这些网格线在视觉上表现为竖线
        max: "dataMax", // "dataMax" 是 ECharts 提供的特殊值,表示使用数据中的最大值作为坐标轴的最大值
      },
    ],
    yAxis: [
      {
        type: "value",
        show: false,
        // Value should be symmetric around zero
        min: lastClose - maxAbs,
        max: lastClose + maxAbs,
      },
      {
        type: "value",
        gridIndex: 1,
        show: false,
      },
      {
        type: "category",
        gridIndex: 2,
        show: false,
      },
    ],
    grid: [
      {
        coordinateSystem: "matrix", // 指定该网格使用矩阵坐标系，而非默认的笛卡尔坐标系
        coord: [0, 0],
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      {
        coordinateSystem: "matrix",
        coord: [0, 4],
        top: 20,
        bottom: 0,
        left: 0,
        right: 0,
      },
      {
        coordinateSystem: "matrix",
        coord: [4, 0],
        top: 15,
        bottom: 2,
        left: 2,
        right: 2,
      },
    ],
    series: [
      {
        type: "line",
        symbolSize: 0,
        data: priceData,
        markPoint: {
          symbolSize: 0,
          symbol: "circle",
          data: [
            {
              relativeTo: "coordinate",
              x: 0,
              y: 0,
              name: "max",
              type: "max",
              label: {
                align: "left",
                verticalAlign: "top",
                formatter: priceFormatter(lastClose + maxAbs),
                color: getPriceColor(lastClose + maxAbs),
              },
            },
            {
              relativeTo: "coordinate",
              x: 0,
              y: "50%",
              name: lastClose + "",
              label: {
                align: "left",
                verticalAlign: "middle",
                formatter: priceFormatter(lastClose),
                color: getPriceColor(lastClose),
              },
            },
            {
              relativeTo: "coordinate",
              x: 0,
              y: "100%",
              name: "min",
              type: "min",
              label: {
                align: "left",
                verticalAlign: "bottom",
                formatter: priceFormatter(lastClose - maxAbs),
                color: getPriceColor(lastClose - maxAbs),
              },
            },
            {
              relativeTo: "coordinate",
              x: "100%",
              y: 0,
              name: priceFormatter((maxAbs / lastClose) * 100) + "%",
              label: {
                align: "right",
                verticalAlign: "top",
                color: colorRed,
                formatter: "{b}",
              },
            },
            {
              relativeTo: "coordinate",
              x: "100%",
              y: "50%",
              name: "0%",
              label: {
                align: "right",
                verticalAlign: "middle",
                color: colorGray,
                formatter: "{b}",
              },
            },
            {
              relativeTo: "coordinate",
              x: "100%",
              y: "100%",
              name: "-" + priceFormatter((maxAbs / lastClose) * 100) + "%",
              label: {
                align: "right",
                verticalAlign: "bottom",
                color: colorGreen,
                formatter: "{b}",
              },
            },
          ],
        },
      },
      {
        type: "line",
        symbolSize: 0,
        data: averageData,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        type: "line",
        symbolSize: 0,
        data: averageData,
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: {
          color: "#FFC458",
          width: 1,
        },
      },
      {
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData.map((item, index) => {
          // Compare current price with previous price to determine color
          let color = colorGray;
          if (index > 0) {
            const currentPrice = priceData[index][1];
            const prevPrice = priceData[index - 1][1];
            color = currentPrice > prevPrice ? colorRed : colorGreen;
          }
          return {
            value: [item[0], item[1]],
            itemStyle: {
              color: color,
            },
          };
        }),
      },
      {
        name: "Order Book",
        type: "bar",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: orderData,
        barWidth: "90%",
        label: {
          show: true,
          position: "insideLeft",
        },
      },
    ],
    matrix: {
      left: matrixMargin,
      right: matrixMargin,
      top: matrixMargin,
      bottom: matrixMargin,
      x: {
        show: false,
        data: Array(5).fill(null),
      },
      y: {
        show: false,
        data: Array(5).fill(null),
      },
      body: {
        data: [
          {
            coord: [
              [0, 3],
              [0, 3],
            ],
            mergeCells: true,
          },
          {
            coord: [
              [0, 3],
              [4, 4],
            ],
            mergeCells: true,
          },
          {
            coord: [
              [4, 4],
              [0, 4],
            ],
            mergeCells: true,
          },
        ],
      },
    },
    graphic: {
      elements: Array.from({ length: 3 }, (_, i) => {
        // 生成 3 条水平横向线
        const lineWidth = 1;
        return {
          type: "line",
          shape: {
            x1: matrixMargin + lineWidth, // 横向起点（左侧）
            y1: (matrixHeight / 5) * (i + 1),
            x2: (matrixWidth / 5) * 4 + matrixMargin, // 横向终点（右侧）
            y2: (matrixHeight / 5) * (i + 1),
          },
          style: {
            stroke: i === 1 ? "#bbb" : "#eee",
            lineWidth,
            lineDash: i == 1 ? "dashed" : false,
          },
        };
      }).concat(
        Array.from({ length: 3 }, (_, i) => {
          // 生成 3 条垂直纵向线
          const lineWidth = 1;
          return {
            type: "line",
            shape: {
              x1: (matrixWidth / 5) * (i + 1) + matrixMargin,
              y1: matrixMargin,
              x2: (matrixWidth / 5) * (i + 1) + matrixMargin,
              y2: matrixHeight + matrixMargin,
            },
            style: {
              stroke: "#eee",
              lineDash: false,
              lineWidth,
            },
          };
        }),
      ),
    },
  };

  return (
    <div className="w-full h-96">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
