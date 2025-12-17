import { Badge } from "@/components/ui/badge";
import { useConfig } from "@/hooks/cron";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/cron-config")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Cron Config",
			},
		],
	}),
});

function RouteComponent() {
	const { data } = useConfig("/conf/conf-prod.yaml");
	return (
		<>
			<div>Hello "/_layout/cron-config"!</div>
			<div className="p-4">
				{data && (
					<>
						<Badge>{data.key}</Badge>
						<div className="bg-slash p-1 rounded-lg shadow border">
							<pre>{atob(data.value)}</pre>
						</div>
					</>
				)}
			</div>
		</>
	);
}
