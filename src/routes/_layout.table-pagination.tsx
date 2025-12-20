import { ReactTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICON_SRC } from "@/consts";
import { useFakerUser } from "@/hooks/faker";
import type { IFakerUser } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/table-pagination")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Pagination Table",
			},
		],
	}),
});

function RouteComponent() {
	const columns: ColumnDef<IFakerUser>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableHiding: false,
			enableSorting: false,
			enableColumnFilter: false,
			size: 24,
		},
		{
			accessorKey: "id",
			header: "ID",
			enableSorting: true,
			enableColumnFilter: false,
			size: 60,
		},
		{
			accessorKey: "name",
			header: "NAME",
			enableSorting: true,
			enableColumnFilter: true,
		},
		{
			accessorKey: "age",
			header: "AGE",
			enableSorting: true,
			enableColumnFilter: false,
			size: 60,
		},
		{
			accessorKey: "role",
			header: "ROLE",
			enableSorting: true,
		},
		{
			accessorKey: "team",
			header: "TEAM",
			enableSorting: true,
			enableColumnFilter: true,
		},
		{
			accessorKey: "email",
			header: "EMAIL",
			enableSorting: true,
			enableColumnFilter: true,
		},
		{
			accessorKey: "status",
			header: "STATUS",
			enableSorting: true,
			enableColumnFilter: true,
			cell: ({ row }) => {
				const orig = row.original;
				return (
					<Badge
						variant={`${
							orig.status == "paused"
								? "destructive"
								: orig.status == "vacation"
									? "default"
									: "outline"
						}`}
					>
						{orig.status}
					</Badge>
				);
			},
			meta: {
				filterVariant: "select",
				selectItems: [
					{ value: "active", name: "Active" },
					{ value: "paused", name: "Paused" },
					{ value: "vacation", name: "Vacation" },
				],
			},
			size: 114,
		},
		{
			id: "actions",
			header: "ACTIONS",
			enableHiding: false,
			cell: ({ row }) => {
				const orig = row.original;

				return (
					<div>
						<Button variant="ghost" size="icon">
							<ReactSVG
								src={ICON_SRC["edit"]}
								className="text-primary w-6"
								onClick={() => navigator.clipboard.writeText(orig.email)}
							/>
						</Button>
						<Button variant="ghost" size="icon">
							<ReactSVG
								src={ICON_SRC["kill"]}
								className="text-yellow-500 w-6"
							/>
						</Button>
						<Button variant="ghost" size="icon">
							<ReactSVG src={ICON_SRC["delete"]} className="text-red-500 w-6" />
						</Button>
					</div>
				);
			},
			size: 128,
		},
	];

	const initialVisibilityColumns = [
		"select",
		"name",
		"role",
		"status",
		"actions",
	];
	const rowsPerPageList: number[] = [10, 20, 30, 50];
	const [rowsPerPage, setRowsPerPage] = useState<string>(
		`${rowsPerPageList[0]}`,
	);

	const { data, isLoading, isFetching, refetch } = useFakerUser(100);
	const flatData = useMemo(() => data?.list ?? [], [data]);

	return (
		<div>
			<div>Hello "/_layout/table"!</div>

			<ReactTable
				data={flatData}
				refetch={refetch}
				isFetching={isFetching}
				isLoading={isLoading}
				columns={columns}
				initialVisibilityColumns={initialVisibilityColumns}
				rowsPerPageList={rowsPerPageList}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				subHeight={200}
				type="pagination"
			/>
		</div>
	);
}
