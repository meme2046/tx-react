import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type CSSProperties,
} from "react";
import {
  Chart as G2Chart,
  type G2Spec,
  type ChartOptions as G2ChartOptions,
} from "@antv/g2";

export type ChartRef = G2Chart | undefined;

export type ChartOptions = Omit<G2ChartOptions, "container">;

export type ChartProps = {
  options: G2Spec | null;
  renderer?: G2ChartOptions["renderer"];
  style?: CSSProperties;
  className?: string;
  onInit?: () => void;
};

export const Chart = forwardRef<ChartRef, ChartProps>((props, ref) => {
  const { options, style, className, onInit, renderer } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<G2Chart>(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (chartRef.current || !containerRef.current) return;
    chartRef.current = new G2Chart({
      container: containerRef.current,
      renderer,
    });
    setInit(true);
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [renderer]);

  useEffect(() => {
    if (init) onInit?.();
  }, [init, onInit]);

  useEffect(() => {
    if (chartRef.current && options) {
      chartRef.current.options(options);
      chartRef.current.render();
    }
  }, [options]);

  useImperativeHandle(ref, () => chartRef.current ?? undefined, [init]);

  return <div ref={containerRef} className={className} style={style} />;
});
