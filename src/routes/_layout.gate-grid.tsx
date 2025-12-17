import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/gate-grid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/gate-grid"!</div>
}
