import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/grid")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Grid Layout",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<>
			<div>Hello "/_layout/grid"!</div>
			<div className="p-4 grid grid-cols-4 gap-4 [&>div]:bg-primary [&>div]:rounded [&>div]:h-16">
				<div>01</div>
				<div>02</div>
				<div>03</div>
				<div>04</div>
				<div>05</div>
				<div>06</div>
				<div>07</div>
				<div>08</div>
				<div>09</div>
			</div>
		</>
	);
}
