import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { AppProvider } from "./components/providers";
import { useApp } from "./hooks/use-app";

// Create a new router instance

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	scrollRestoration: true,
	context: {
		app: undefined!,
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export function App() {
	const app = useApp();
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} context={{ app: app }} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<AppProvider>
				<App />
			</AppProvider>
		</StrictMode>
	);
}
