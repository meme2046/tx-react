import { getPanel } from "@/utils/panel";
import { Base, type CommonConfig, type PlotEvent } from "@ant-design/charts";
import { createFileRoute } from "@tanstack/react-router";
import { round } from "lodash";
import format from "pretty-format";

export const Route = createFileRoute("/_layout/g2/data-panel")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Data Panel",
      },
    ],
  }),
});

const data = [
  { month: "Jan", city: "Tokyo", temperature: 7 },
  { month: "Jan", city: "London", temperature: 3.9 },
  { month: "Feb", city: "Tokyo", temperature: 6.9 },
  { month: "Feb", city: "London", temperature: 4.2 },
  { month: "Mar", city: "Tokyo", temperature: 9.5 },
  { month: "Mar", city: "London", temperature: 5.7 },
  { month: "Apr", city: "Tokyo", temperature: 14.5 },
  { month: "Apr", city: "London", temperature: 8.5 },
  { month: "May", city: "Tokyo", temperature: 18.4 },
  { month: "May", city: "London", temperature: 11.9 },
  { month: "Jun", city: "Tokyo", temperature: 21.5 },
  { month: "Jun", city: "London", temperature: 15.2 },
  { month: "Jul", city: "Tokyo", temperature: 25.2 },
  { month: "Jul", city: "London", temperature: 17 },
  { month: "Aug", city: "Tokyo", temperature: 26.5 },
  { month: "Aug", city: "London", temperature: 16.6 },
  { month: "Sep", city: "Tokyo", temperature: 23.3 },
  { month: "Sep", city: "London", temperature: 14.2 },
  { month: "Oct", city: "Tokyo", temperature: 18.3 },
  { month: "Oct", city: "London", temperature: 10.3 },
  { month: "Nov", city: "Tokyo", temperature: 13.9 },
  { month: "Nov", city: "London", temperature: 6.6 },
  { month: "Dec", city: "Tokyo", temperature: 9.6 },
  { month: "Dec", city: "London", temperature: 4.8 },
];

function RouteComponent() {
  const config: CommonConfig = {
    type: "view",
    data: data,
    autoFit: true,
    encode: {
      x: "month",
      y: "temperature",
      color: "city",
    },
    axis: {
      y: {
        labelFormatter: (d: number) => d + "°C",
      },
    },
    children: [
      {
        type: "line",
        encode: {
          shape: "smooth",
        },
      },
      {
        type: "point",
        encode: {
          shape: "point",
        },
        tooltip: false,
      },
    ],
    onReady: ({ chart }) => {
      const container = chart.getContainer();

      chart.on("afterrender", (_event: PlotEvent) => {
        if (container) {
          // 监听鼠标在容器内移动
          container.addEventListener("mousemove", (e: MouseEvent) => {
            const panel = getPanel({
              container,
              id: "left-panel",
              width: "220px",
              pos: "left",
            });
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            panel.innerHTML = `
              <div>🧱容器尺寸: ${container.offsetWidth} ✘ ${container.offsetHeight}</div>
              <div>容器位置: ${rect.left}, ${rect.top}</div>
              <div>坐标: (${e.clientX}, ${e.clientY})</div>
              <div>🔢容器坐标: (${x}, ${y})</div>
              <div>事件类型: ${e.type}</div>
            `;
          });
        }
      });

      chart.on("plot:pointermove", (evt: PlotEvent) => {
        const { nativeEvent, x, y } = evt;
        if (!nativeEvent) return; // 过滤程序触发的事件

        const yScale = chart.getScaleByChannel("y");
        const coordinate = chart.getCoordinate().getOptions();
        let yValue = undefined;

        if (yScale || coordinate) {
          const normalizedY =
            (y - coordinate.paddingTop - coordinate.paddingTop) /
            coordinate.innerHeight;

          yValue = yScale.invert(normalizedY);
        }

        const p = getPanel({
          container,
          id: "right-panel",
          width: "280px",
          pos: "right",
        });

        const pointData = chart.getDataByXY({ x, y }, { shared: true });
        if (p) {
          p.innerText = `X: ${round(x, 2)}, Y: ${round(y, 2)}, YValue: ${round(yValue, 2)}\nEventData: ${format(pointData)}`;
        }
      });
    },
  };

  return (
    <>
      <Base {...config} className="w-full" />
    </>
  );
}
