import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({
			to: "/bitget-sf",
		});
	},
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Home",
			},
		],
	}),
});
function RouteComponent() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
