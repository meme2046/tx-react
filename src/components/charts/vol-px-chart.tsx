import ReactECharts, { type EChartsOption } from "echarts-for-react";
interface Props {
  title?: string;
  className?: string;
}
const defaultProps = {
  title: "",
  className: "w-full h-96",
};
export function VolPxChart(props: Props) {
  const { title, className } = { ...defaultProps, ...props };
  const titles = [
    {
      text: title,
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
  ];

  const tooltip = {
    show: true,
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
    formatter: (params: string | any[]) => {
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
  };

  const option: EChartsOption = {
    title: titles,
  };
  return (
    <div className={className}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
