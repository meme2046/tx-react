import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ICON_SRC } from "@/consts";
import { useFakerUser } from "@/hooks/faker";
import type { IFakerUser } from "@/types";
import { createFileRoute, useLayoutEffect } from "@tanstack/react-router";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type Row,
	type Table,
} from "@tanstack/react-table";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import { memo, useMemo, useRef, type RefObject } from "react";
import { ReactSVG } from "react-svg";

export const Route = createFileRoute("/_layout/virtual-exp")({
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
	const minFixedWidth = 80;

	const { data, refetch, isFetching } = useFakerUser(100);
	const flatData = useMemo(() => data?.list ?? [], [data]);

	const table = useReactTable<IFakerUser>({
		data: flatData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
	});

	// The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	// All important CSS styles are included as inline styles for this example. This is not recommended for your code.
	return (
		<div className="app">
			<p>({flatData.length} rows)</p>
			<Button
				className="cursor-pointer"
				variant="outline"
				onClick={() => {
					refetch();
				}}
			>
				{isFetching ? (
					<ReactSVG
						src={ICON_SRC["processing"]}
						className={`${isFetching ? "animate-spin" : ""}`}
					/>
				) : undefined}
				<span>Refresh Data</span>
			</Button>
			<div
				className="container"
				ref={tableContainerRef}
				style={{
					overflow: "auto", // our scrollable table container
					position: "relative", // needed for sticky header
					height: "800px", // should be a fixed height
				}}
			>
				{/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
				<table style={{ display: "grid" }}>
					<thead
						style={{
							display: "grid",
							position: "sticky",
							top: 0,
							zIndex: 1,
						}}
						className="sticky top-0 bg-background/40 backdrop-blur"
					>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr
								key={headerGroup.id}
								style={{ display: "flex", width: "100%" }}
							>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											style={{
												display: "flex",
												width: header.getSize(),
											}}
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
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<TableBodyWrapper
						table={table}
						tableContainerRef={tableContainerRef}
						minFixedWidth={minFixedWidth}
					/>
				</table>
			</div>
		</div>
	);
}

interface TableBodyWrapperProps<T> {
	table: Table<T>;
	tableContainerRef: React.RefObject<HTMLDivElement | null>;
	minFixedWidth: number;
}

function TableBodyWrapper<T>({
	table,
	tableContainerRef,
	minFixedWidth,
}: TableBodyWrapperProps<T>) {
	const rowRefsMap = useRef<Map<number, HTMLTableRowElement>>(new Map());

	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		// measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
		onChange: (instance) => {
			// requestAnimationFrame(() => {
			instance.getVirtualItems().forEach((virtualRow) => {
				const rowRef = rowRefsMap.current.get(virtualRow.index);
				if (!rowRef) return;
				rowRef.style.transform = `translateY(${virtualRow.start}px)`;
			});
			// })
		},
	});

	useLayoutEffect(() => {
		rowVirtualizer.measure();
	}, [table.getState()]);

	return (
		<TableBody
			rowRefsMap={rowRefsMap}
			rowVirtualizer={rowVirtualizer}
			table={table}
			minFixedWidth={minFixedWidth}
		/>
	);
}

interface TableBodyProps<T> {
	table: Table<T>;
	rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
	rowRefsMap: RefObject<Map<number, HTMLTableRowElement>>;
	minFixedWidth: number;
}

function TableBody<T>({
	rowVirtualizer,
	table,
	rowRefsMap,
	minFixedWidth,
}: TableBodyProps<T>) {
	const { rows } = table.getRowModel();
	const virtualRowIndexes = rowVirtualizer.getVirtualIndexes();

	return (
		<tbody
			style={{
				display: "grid",
				height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
				position: "relative", // needed for absolute positioning of rows
			}}
		>
			{virtualRowIndexes.map((virtualRowIndex) => {
				const row = rows[virtualRowIndex];
				return (
					<TableBodyRowMemo
						key={row.id}
						row={row}
						rowRefsMap={rowRefsMap}
						rowVirtualizer={rowVirtualizer}
						virtualRowIndex={virtualRowIndex}
						minFixedWidth={minFixedWidth}
					/>
				);
			})}
		</tbody>
	);
}

interface TableBodyRowProps<T> {
	row: Row<T>;
	rowRefsMap: RefObject<Map<number, HTMLTableRowElement>>;
	rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
	virtualRowIndex: number;
	minFixedWidth: number;
}

function TableBodyRow<T>({
	row,
	rowRefsMap,
	rowVirtualizer,
	virtualRowIndex,
	minFixedWidth,
}: TableBodyRowProps<T>) {
	return (
		<tr
			data-index={virtualRowIndex} // needed for dynamic row height measurement
			ref={(node) => {
				if (node && typeof virtualRowIndex !== "undefined") {
					rowVirtualizer.measureElement(node); // measure dynamic row height
					rowRefsMap.current.set(virtualRowIndex, node); // store ref for virtualizer to apply scrolling transforms
				}
			}}
			key={row.id}
			style={{
				display: "flex",
				position: "absolute",
				width: "100%",
			}}
		>
			{row.getVisibleCells().map((cell) => {
				return (
					<td
						key={cell.id}
						style={{
							display: "flex",
							width: cell.column.getSize(),
						}}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				);
			})}
		</tr>
	);
}

// test out when rows don't re-render at all (future TanStack Virtual release can make this unnecessary)
const TableBodyRowMemo = memo(
	TableBodyRow,
	(_prev, next) => next.rowVirtualizer.isScrolling,
) as typeof TableBodyRow;
