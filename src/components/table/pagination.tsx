import type { RowData, Table } from "@tanstack/react-table";
import { useRef } from "react";
import { PaginationBottom } from "./pagination-bottom";
import { TableBase } from "./table-base";

interface IPaginationTable<T> {
	table: Table<T>;
	subHeight: number;
	isFetching: boolean;
	isLoading: boolean;
	keyField?: string;
}

export function PaginationTable<T extends RowData>(props: IPaginationTable<T>) {
	const { table, subHeight, isFetching, isLoading, keyField } = props;

	const tableContainerRef = useRef<HTMLDivElement>(null);
	const minFixedWidth = 128;
	return (
		<>
			<TableBase
				tableContainerRef={tableContainerRef}
				subHeight={subHeight}
				table={table}
				minFixedWidth={minFixedWidth}
				isFetching={isFetching}
				isLoading={isLoading}
				keyField={keyField}
			/>
			<PaginationBottom table={table} />
		</>
	);
}
