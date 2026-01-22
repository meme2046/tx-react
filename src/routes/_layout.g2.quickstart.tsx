import { useG2 } from "@/hooks/g2/use-g2";
import type { G2Spec } from "@antv/g2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/g2/quickstart")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "G2 Quickstart",
      },
    ],
  }),
});

function RouteComponent() {
  const data = [
    { genre: "Sports", sold: 275 },
    { genre: "Strategy", sold: 115 },
    { genre: "Action", sold: 120 },
    { genre: "Shooter", sold: 350 },
    { genre: "Other", sold: 150 },
  ];

  const options: G2Spec = {
    type: "interval",
    width: 640,
    height: 480,
    data,
    encode: { x: "genre", y: "sold" },
  };

  const ref = useG2({
    options: options,
  });

  return <div className="w-full h-64" ref={ref} />;
}
