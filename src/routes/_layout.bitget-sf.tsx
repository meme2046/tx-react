import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/bitget-sf")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Bitget SF",
			},
		],
	}),
});

function RouteComponent() {
	return <div>Hello "/_layout/bitget-sf"!</div>;
}
