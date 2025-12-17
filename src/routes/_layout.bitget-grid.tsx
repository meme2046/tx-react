import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/bitget-grid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/bitget-grid"!</div>
}
