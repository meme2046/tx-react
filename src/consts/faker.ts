import type { IHeaderColumn } from "@/types";

export const columns: IHeaderColumn[] = [
	{ name: "ID", id: "id", enableSorting: true },
	{ name: "NAME", id: "name", enableSorting: true },
	{ name: "AGE", id: "age", enableSorting: true },
	{ name: "ROLE", id: "role", enableSorting: true },
	{ name: "TEAM", id: "team" },
	{ name: "EMAIL", id: "email" },
	{ name: "STATUS", id: "status", enableSorting: true },
	{ name: "ACTIONS", id: "actions" },
];
export const statusOptions = [
	{ name: "Active", id: "active" },
	{ name: "Paused", id: "paused" },
	{ name: "Vacation", id: "vacation" },
];
