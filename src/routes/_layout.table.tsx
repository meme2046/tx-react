import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/table")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_layout/table"!</div>;
}
