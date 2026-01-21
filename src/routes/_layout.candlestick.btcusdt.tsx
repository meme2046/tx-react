import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/candlestick/btcusdt')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/candlestick/btcusdt"!</div>
}
