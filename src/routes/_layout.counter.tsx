import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/counter")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Counter",
			},
		],
	}),
});

function RouteComponent() {
	return <>Counter Page</>;
}
