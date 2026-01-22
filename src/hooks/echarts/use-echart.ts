import type { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { useResizeObserver } from "../use-resize-observer";

interface UseEChartProps {
  opts?: echarts.EChartsInitOpts;
  theme?: string | object | null;
  options: EChartsOption;
  loading?: boolean;
  onReady?: (chart: ECharts) => void;
}

export function useEChart({
  options,
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

    chartRef.current = echarts.init(ref.current, theme, opts);
    onReady?.(chartRef.current);

    return () => {
      // 它在 组件卸载 或 effect 重新执行前 被调用。
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  // set options
  useEffect(() => {
    chartRef.current?.setOption(options, true);
  }, [options]);

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
