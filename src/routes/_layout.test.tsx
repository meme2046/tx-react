import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/test")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Test Page",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<div className="p-4">
			<p>Hello "/_layout/test"!</p>
		</div>
	);
}
