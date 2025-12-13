import { createFileRoute } from "@tanstack/react-router";
import { Outlet, redirect, useRouter } from "@tanstack/react-router";

import { useApp } from "@/lib/hooks/use-app";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth")({
	beforeLoad: ({ context, location }) => {
		if (!context.app.user) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const app = useApp();

	const handleLogout = () => {
		if (window.confirm("Are you sure you want to logout?")) {
			app?.logout().then(() => {
				router.invalidate().finally(() => {
					navigate({ to: "/" });
				});
			});
		}
	};

	return (
		<div className="flex flex-col">
			<div className="flex justify-start p-1 mr-10">
				<Button
					onClick={handleLogout}
					variant="outline"
					className="cursor-pointer"
				>
					Logout
				</Button>
			</div>
			<Outlet />
		</div>
	);
}
