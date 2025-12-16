import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/cron-api")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Cron API Setting",
			},
		],
	}),
});

function RouteComponent() {
	return <div>Hello "/_layout/cron-api"!</div>;
}
