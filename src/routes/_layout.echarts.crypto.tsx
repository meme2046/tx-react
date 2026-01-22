import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/echarts/crypto")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "加密货币图表",
      },
    ],
  }),
});

function RouteComponent() {
  return <div>Hello "/_layout/crypto"!</div>;
}
