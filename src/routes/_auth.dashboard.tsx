import { createFileRoute } from "@tanstack/react-router";

import { useApp } from "@/hooks/use-app";

export const Route = createFileRoute("/_auth/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const app = useApp();

	return (
		<section className="grid gap-2 p-2">
			<p>Hi {app?.user?.name}!</p>
			<p>You are currently on the dashboard route.</p>
		</section>
	);
}
