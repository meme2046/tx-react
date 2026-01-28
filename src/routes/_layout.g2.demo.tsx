import { KLineG2 } from "@/components/charts/kline-g2";
import { useJson } from "@/hooks/use-json";
import { parseKlineData } from "@/utils/parse";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/g2/demo")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "G2 Demo",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useJson(
    "https://api4.binance.com/api/v3/uiKlines?symbol=BTCUSDT&interval=5m&limit=200",
  );

  const { parsedData } = useMemo(() => parseKlineData(data), [data]);

  return <KLineG2 data={parsedData} />;
}
