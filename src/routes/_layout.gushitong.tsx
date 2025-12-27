import { useBanner } from "@/hooks/gushitong/use-banner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/gushitong")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useBanner("asia");
	return <div>{JSON.stringify(data)}</div>;
}
