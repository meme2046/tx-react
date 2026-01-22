import { useEffect } from "react";

export function useResizeObserver(
  ref: React.RefObject<HTMLDivElement | null>,
  onResize: () => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      onResize();
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref, onResize]);
}
