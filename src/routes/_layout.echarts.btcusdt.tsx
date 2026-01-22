import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/echarts/btcusdt')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/candlestick/btcusdt"!</div>
}
