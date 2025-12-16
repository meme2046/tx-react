import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import reportWebVitals from "./reportWebVitals.ts";
import { AppProvider } from "./components/providers";
import { useApp } from "./hooks/use-app.ts";

import { useSnapshot } from "valtio";
import { storePersist } from "./lib/valtio";
import { ToastContainer } from "react-toastify";

import "@theme-toggles/react/css/Expand.css";

import "./index.css";

const queryClient = new QueryClient();

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
	const { theme } = useSnapshot(storePersist);
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} context={{ app: app }} />
			<ReactQueryDevtools initialIsOpen={false} />
			<ToastContainer
				position="bottom-center"
				theme={theme == "system" ? "colored" : theme}
				autoClose={4000}
			/>
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
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
