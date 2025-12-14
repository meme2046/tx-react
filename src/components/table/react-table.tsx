import { useEffect, useState } from "react";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type {
	ColumnDef,
	ColumnFiltersState,
	ColumnSort,
	RowData,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";

import { TopContent } from "./top-content.tsx";
import type {
	FetchNextPageOptions,
	RefetchOptions,
} from "@tanstack/react-query";
import { reduce } from "lodash";
import { getKeyValue } from "@/utils/util.ts";
import { VirtualizedTable } from "./virtualized.tsx";
import { PaginationTable } from "./pagination.tsx";

interface IReactTable<T> {
	data: T[];
	fetchNextPage?: (options?: FetchNextPageOptions) => Promise<unknown>;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	refetch: (options?: RefetchOptions) => Promise<unknown>;
	isFetching: boolean;
	isLoading: boolean;
	columns: ColumnDef<T>[];
	initialVisibilityColumns: string[];
	rowsPerPageList: number[];
	rowsPerPage: string;
	setRowsPerPage: (rowsPerPage: string) => void;
	initialSorting?: ColumnSort[];
	estimateRowHeight?: number;
	overscan?: number;
	subHeight: number;
	keyField?: string;
	total?: number;
	type?: "pagination" | "virtualized";
}

export function ReactTable<T extends RowData>(props: IReactTable<T>) {
	const {
		data,
		fetchNextPage,
		refetch,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
		isLoading,
		columns,
		initialVisibilityColumns,
		rowsPerPageList,
		rowsPerPage,
		setRowsPerPage,
		initialSorting,
		estimateRowHeight,
		overscan,
		subHeight,
		keyField,
		total,
		type,
	} = { type: "pagination", ...props };

	const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		reduce(
			columns,
			(result: Record<string, boolean>, column) => {
				const id =
					getKeyValue(column, "id") ??
					getKeyValue(column, "accessorKey");
				result[id] =
					initialVisibilityColumns.includes(id) ||
					column.enableHiding === false;
				return result;
			},
			{}
		)
	);
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: Number(rowsPerPage),
	});

	const table = useReactTable({
		data: data,
		columns,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onSortingChange: type === "pagination" ? setSorting : undefined,
		getPaginationRowModel:
			type === "pagination" ? getPaginationRowModel() : undefined,
		onPaginationChange: type === "pagination" ? setPagination : undefined,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
		manualSorting: false,
		debugTable: false,
	});

	const visibilityColumns = table
		.getAllColumns()
		.filter((column) => column.getCanHide());

	useEffect(() => {
		if (type === "pagination") {
			table.setPageSize(Number(rowsPerPage));
			table.setPageIndex(0);
		}
	}, [rowsPerPage, table, type]);

	return (
		<div className="space-y-1">
			<TopContent
				fetched={table.getRowCount()}
				rowsPerPage={rowsPerPage}
				rowsPerPageList={rowsPerPageList}
				setRowsPerPage={setRowsPerPage}
				visibilityColumns={visibilityColumns}
				refetch={refetch}
				isFetching={isFetching}
				hasNextPage={hasNextPage}
				total={total}
			/>

			{type === "virtualized" ? (
				<VirtualizedTable
					table={table}
					rowsPerPage={rowsPerPage}
					estimateRowHeight={estimateRowHeight ?? 36}
					overscan={overscan ?? 6}
					subHeight={subHeight}
					setSorting={setSorting}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					isFetching={isFetching}
					isLoading={isLoading}
					fetchNextPage={fetchNextPage}
					keyField={keyField}
				/>
			) : (
				<PaginationTable
					table={table}
					subHeight={subHeight}
					isFetching={isFetching}
					isLoading={isLoading}
					keyField={keyField}
				/>
			)}
		</div>
	);
}
