import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useFakerUser } from "@/hooks/faker";
import type { IFakerUser } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/table-basic")({
	component: RouteComponent,
});

function RouteComponent() {
	const columnHelper = createColumnHelper<IFakerUser>();

	const columns = [
		columnHelper.accessor("id", {
			cell: (info) => info.getValue(),
			header: "ID",
		}),
		columnHelper.accessor("avatar", {
			header: "Avatar",
			cell: (info) => (
				<Avatar>
					<AvatarImage src={info.getValue()} />
				</Avatar>
			),
		}),
		columnHelper.accessor((row) => row.name, {
			id: "name",
			cell: (info) => <i>{info.getValue()}</i>,
			header: () => <span>Name</span>,
		}),
		columnHelper.accessor("age", {
			header: () => "Age",
			cell: (info) => info.renderValue(),
		}),
		columnHelper.accessor("role", {
			header: () => <span>Role</span>,
		}),
		columnHelper.accessor("team", {
			header: "Team",
		}),
		columnHelper.accessor("email", {
			header: "Email",
		}),
		columnHelper.accessor("status", {
			header: "Status",
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => info.getValue().toLocaleString(),
		}),
	];

	const { data } = useFakerUser(10);
	const flatData = useMemo(() => data?.list ?? [], [data]);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data: flatData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-2">
			<Table className="border-collapse table-auto">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							className="w-full"
							data-index={row.index}
							data-state={row.getIsSelected() && "selected"}
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
