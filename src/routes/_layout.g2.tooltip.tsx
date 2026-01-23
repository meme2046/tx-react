import { useG2 } from "@/hooks/g2/use-g2";
import { useJson } from "@/hooks/use-json";
import type { G2Spec } from "@antv/g2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/g2/tooltip")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useJson("https://assets.antv.antgroup.com/g2/indices.json");

  const options: G2Spec = {
    type: "line",
    autoFit: true,
    data: data || [],
    encode: {
      x: (d: any) => new Date(d.Date),
      y: ["Close"],
      // color: ["Symbol"],
    },
    // transform: [{ type: "normalizeY", basis: "first", groupBy: "color" }],
    axis: {
      y: {
        title: "↑ Change in price (%)",
      },
    },
    interaction: {
      tooltip: {
        crosshairs: true,
        crosshairsXStroke: "red",
        crosshairsYStroke: "blue",
      },
      sliderWheel: {
        wheelSensitivity: 0.08,
        minRange: 0.02,
      },
    },
    tooltip: {
      title: (d) => new Date(d.Date).toUTCString(),
      items: [
        (_d, i, _data, column) => ({
          name: "Close",
          value: i ? column.y.value[i].toFixed(1) : "",
        }),
      ],
    },
    slider: {
      x: {
        // labelFormatter: (d: any) => d.toLocaleString(),
      },
    },
    // labels: [{ text: "Symbol", selector: "last", fontSize: 10 }],
  };
  const { ref } = useG2({ options });
  return <div className="w-1/2 h-96" ref={ref} />;
}
