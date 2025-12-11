import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("test", "routes/test.tsx", [
		index("routes/test.index.tsx"),
		route("settings", "routes/test.settings.tsx"),
	]),
] satisfies RouteConfig;
