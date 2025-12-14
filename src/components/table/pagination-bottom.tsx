import type { RowData, Table } from "@tanstack/react-table";
import { Button } from "../ui/button";

import { ReactSVG } from "react-svg";
import { ICON_SRC } from "@/consts";
import { Badge } from "../ui/badge";

interface IBottomContent<T> {
	table: Table<T>;
	// pages: number;
	// page: number;
	// setPage: (page: number) => void;
}

export const PaginationBottom = <T extends RowData>(
	props: IBottomContent<T>
) => {
	const { table } = props;
	// const pages = Math.ceil(table.getFilteredRowModel().rows.length / Number(rowsPerPage))

	return (
		<div className="flex justify-between items-center text-sm flex-wrap p-1">
			<Badge className="text-nowrap" variant="secondary">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</Badge>
			<Badge variant="secondary">
				<span>Page &nbsp;</span>
				<strong>
					{table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount().toLocaleString()}
				</strong>
				<span>&nbsp;| Go to page: </span>
				<input
					type="number"
					min="1"
					max={table.getPageCount()}
					defaultValue={table.getState().pagination.pageIndex + 1}
					onChange={(e) => {
						const page = e.target.value
							? Number(e.target.value) - 1
							: 0;
						table.setPageIndex(page);
					}}
					className="border p-1 rounded w-12 bg-background"
				/>
			</Badge>
			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.firstPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ReactSVG
						src={ICON_SRC["chevron-double-left"]}
						className="w-3"
					/>
					<span>&nbsp;First</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ReactSVG src={ICON_SRC["arrow-left"]} className="w-3" />
					<span>Previous</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ReactSVG src={ICON_SRC["arrow-right"]} className="w-3" />
					<span>Next</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.lastPage()}
					disabled={!table.getCanNextPage()}
				>
					<ReactSVG
						src={ICON_SRC["chevron-double-right"]}
						className="w-3"
					/>
					<span>&nbsp;Last</span>
				</Button>
			</div>
		</div>
	);
};
