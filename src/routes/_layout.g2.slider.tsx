import { Base } from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/g2/slider")({
  component: RouteComponent,
});

function RouteComponent() {
  // 生成示例数据
  const data = [];
  for (let i = 1; i <= 30; i++) {
    const date = `2023-01-${String(i).padStart(2, "0")}`;
    data.push({
      date,
      value: Math.floor(Math.random() * 100) + 50,
      type: "Sales",
    });
    data.push({
      date,
      value: Math.floor(Math.random() * 80) + 30,
      type: "Visits",
    });
  }

  const config = {
    type: "spaceFlex",
    direction: "col",

    ratio: [1, 1],

    children: [
      {
        type: "view",
        data: data,
        children: [
          {
            type: "line",
            encode: {
              x: "date",
              y: "value",
              color: "type",
            },
            style: {
              lineWidth: 2,
            },
          },
        ],
        axis: {
          x: { title: "日期" },
          y: { title: "销售额" },
        },
        title: "销售额趋势",
      },
      {
        type: "view",
        data: data,
        children: [
          {
            type: "interval",
            encode: {
              x: "date",
              y: "value",
              color: "type",
            },
          },
        ],
        axis: {
          x: { title: "日期" },
          y: { title: "访问量" },
        },
        title: "访问量统计",
      },
    ],

    interaction: [
      {
        type: "sliderFilter",
        target: "x", // 共享x轴slider
      },
    ],
  };

  return <Base {...config} className="w-full bg-amber-400" />;
}
