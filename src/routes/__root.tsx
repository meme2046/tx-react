import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { IAppContext } from "@/components/providers";
import { HeadContent } from "@tanstack/react-router";
import { ToggleTheme } from "@/components/toggle-theme";
interface RouterContext {
	app: IAppContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<ToggleTheme />
			<HeadContent />
			<Outlet />
			<TanStackRouterDevtools initialIsOpen={false} />
		</>
	),
});
