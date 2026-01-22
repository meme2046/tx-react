import { Chart } from "@antv/g2";
import type { Chart as G2Chart, G2Spec } from "@antv/g2";
import { useEffect, useRef } from "react";
// Runtime<Spec>
interface UseG2Props {
  options: G2Spec;
  onReady?: (chart: G2Chart) => void;
}

export function useG2({ options, onReady }: UseG2Props) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<G2Chart | null>(null);

  // init
  useEffect(() => {
    if (!ref.current || chartRef.current) return;

    chartRef.current = new Chart({ container: ref.current });

    onReady?.(chartRef.current);

    return () => {
      // 它在 组件卸载 或 effect 重新执行前 被调用。
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  // set option
  useEffect(() => {
    if (chartRef.current && options) {
      chartRef.current.options(options);
      chartRef.current.render();
    }
  }, [options]);

  return ref;
}
