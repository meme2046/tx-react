import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { IAppContext } from "@/components/providers";

interface RouterContext {
	app: IAppContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools initialIsOpen={false} />
		</>
	),
});
