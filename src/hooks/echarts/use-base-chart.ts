import type { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { useResizeObserver } from "./use-resize-observer";

interface UseEChartProps {
  opts?: echarts.EChartsInitOpts;
  theme?: string | object | null;
  option: EChartsOption;
  loading?: boolean;
  onReady?: (chart: ECharts) => void;
}

export function useEChart({
  option,
  loading,
  onReady,
  theme,
  opts,
}: UseEChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  // init
  useEffect(() => {
    if (!ref.current || chartRef.current) return;

    const chart = echarts.init(ref.current, theme, opts);
    chartRef.current = chart;
    onReady?.(chart);

    return () => {
      // 它在 组件卸载 或 effect 重新执行前 被调用。
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  // set option
  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  // loading
  useEffect(() => {
    if (!chartRef.current) return;
    loading ? chartRef.current.showLoading() : chartRef.current.hideLoading();
  }, [loading]);

  // resize ✅
  useResizeObserver(ref, () => {
    chartRef.current?.resize();
  });

  return ref;
}
