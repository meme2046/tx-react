import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/counter")({
	component: CounterComponent,
	head: () => ({
		meta: [
			{
				title: "Counter",
			},
		],
	}),
});

function CounterComponent() {
	return <>Counter Page</>;
}
