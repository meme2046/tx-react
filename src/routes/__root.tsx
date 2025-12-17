import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
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
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Query",
						render: <ReactQueryDevtoolsPanel />,
						defaultOpen: false,
					},
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
						defaultOpen: false,
					},
				]}
			/>
		</>
	),
});
