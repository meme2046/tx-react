import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type Row,
	type Table as TsTable,
} from "@tanstack/react-table";
import {
	useVirtualizer,
	Virtualizer,
	type VirtualItem,
} from "@tanstack/react-virtual";
import { useMemo, useRef } from "react";

export const Route = createFileRoute("/_layout/virtual")({
	component: RouteComponent,
});

function RouteComponent() {
	const columns = useMemo<Array<ColumnDef<IFakerUser>>>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				size: 60,
			},
			{
				accessorKey: "avatar",
				header: "Avatar",
				cell: (info) => (
					<Avatar>
						<AvatarImage src={info.getValue<string>()} />
					</Avatar>
				),
			},
			{
				accessorFn: (row) => row.name,
				id: "name",
				cell: (info) => info.getValue(),
				header: () => <span>Name</span>,
			},
			{
				accessorKey: "age",
				header: () => "Age",
				size: 50,
			},
			{
				accessorKey: "role",
				header: () => "Role",
				size: 50,
			},
			{
				accessorKey: "team",
				header: () => "Team",
				size: 50,
			},
			{
				accessorKey: "email",
				header: "Email",
				size: 80,
			},
			{
				accessorKey: "status",
				header: "Status",
			},
			{
				accessorKey: "createdAt",
				header: "Created At",
				cell: (info) => info.getValue<Date>().toLocaleString(),
				size: 200,
			},
		],
		[],
	);

	// The virtualizer will need a reference to the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const { data, refetch } = useFakerUser(100);
	const flatData = useMemo(() => data?.list ?? [], [data]);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable<IFakerUser>({
		data: flatData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
	});

	const minFixedWidth = 80;

	// All important CSS styles are included as inline styles for this example. This is not recommended for your code.
	return (
		<div className="app">
			<p>{flatData.length} rows</p>
			<Button
				variant="outline"
				onClick={() => {
					refetch();
				}}
			>
				Refresh Data
			</Button>
			<div
				className="relative overflow-auto scrollbar-thin rounded-lg border shadow min-h-64"
				ref={tableContainerRef}
				style={{ maxHeight: `calc(100vh - ${200}px)` }}
			>
				{/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
				<table>
					<TableHeader className="sticky top-0 z-10 bg-transparent backdrop-blur">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="flex" key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											style={{ width: header.getSize() }}
											className={`h-auto shrink-0 ${
												header.getSize() > minFixedWidth ? "grow" : ""
											}`}
										>
											<div
												{...{
													className: header.column.getCanSort()
														? "cursor-pointer select-none"
														: "",
													onClick: header.column.getToggleSortingHandler(),
												}}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{{
													asc: " 🔼",
													desc: " 🔽",
												}[header.column.getIsSorted() as string] ?? null}
											</div>
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TBody table={table} tableContainerRef={tableContainerRef} />
				</table>
			</div>
		</div>
	);
}
interface TableBodyProps {
	table: TsTable<IFakerUser>;
	tableContainerRef: React.RefObject<HTMLDivElement | null>;
}

function TBody({ table, tableContainerRef }: TableBodyProps) {
	const { rows } = table.getRowModel();

	// eslint-disable-next-line react-hooks/incompatible-library
	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		//measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
	});

	const items = rowVirtualizer.getVirtualItems();

	return (
		<TableBody
			style={{
				// display: "grid",
				height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
				position: "relative", //needed for absolute positioning of rows
			}}
		>
			{items.map((virtualRow) => {
				const row = rows[virtualRow.index] as Row<IFakerUser>;
				return (
					<TBodyRow
						key={row.id}
						row={row}
						virtualRow={virtualRow}
						rowVirtualizer={rowVirtualizer}
					/>
				);
			})}
		</TableBody>
	);
}

interface TableBodyRowProps {
	row: Row<IFakerUser>;
	virtualRow: VirtualItem;
	rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

function TBodyRow({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) {
	return (
		<TableRow
			data-index={virtualRow.index} //needed for dynamic row height measurement
			ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
			key={row.id}
			style={{
				display: "flex",
				position: "absolute",
				transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
				width: "100%",
			}}
		>
			{row.getVisibleCells().map((cell) => {
				return (
					<TableCell
						key={cell.id}
						style={{
							display: "flex",
							width: cell.column.getSize(),
						}}
						className="shrink-0 truncate grow"
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				);
			})}
		</TableRow>
	);
}
