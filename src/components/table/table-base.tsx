import type { Row, RowData, Table as TsTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { TableFilter } from "./table-filter";
import { ReactSVG } from "react-svg";
import { ICON_SRC } from "@/consts";
import { type VirtualItem, Virtualizer } from "@tanstack/react-virtual";

interface ITableBase<T> {
	tableContainerRef: React.RefObject<HTMLDivElement | null>;
	subHeight: number;
	table: TsTable<T>;
	minFixedWidth: number;
	isFetching: boolean;
	isLoading: boolean;
	rowVirtualizer?: Virtualizer<HTMLDivElement, Element>;
	hasNextPage?: boolean;
	keyField?: string;
}

export function TableBase<T extends RowData>(props: ITableBase<T>) {
	const {
		tableContainerRef,
		subHeight,
		table,
		minFixedWidth,
		keyField,
		hasNextPage,
		isFetching,
		isLoading,
		rowVirtualizer,
	} = props;
	const { rows } = table.getRowModel();
	const items = rowVirtualizer ? rowVirtualizer.getVirtualItems() : rows;

	return (
		<div
			ref={tableContainerRef}
			style={{ maxHeight: `calc(100vh - ${subHeight}px)` }}
			className="relative overflow-auto scrollbar-thin rounded-lg border shadow min-h-64"
		>
			<Table className="w-full text-sm">
				<TableHeader className="sticky top-0 z-10 bg-muted backdrop-blur">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="flex">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										className={`h-auto shrink-0 ${
											header.getSize() > minFixedWidth
												? "grow"
												: ""
										}`}
										key={header.id}
										style={{ width: header.getSize() }}
									>
										<div
											onClick={header.column.getToggleSortingHandler()}
											className={`leading-6 text-nowrap ${
												header.column.getCanSort()
													? "cursor-pointer select-none"
													: ""
											}`}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
											{header.column.getCanSort()
												? {
														asc: " ⇡",
														desc: " ⇣",
														false: " ♯",
												  }[
														header.column.getIsSorted() as string
												  ]
												: undefined}
										</div>
										<div>
											{header.column.getCanFilter() ? (
												<TableFilter
													column={header.column}
												/>
											) : undefined}
										</div>
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody
					style={
						rowVirtualizer
							? {
									height: `${rowVirtualizer.getTotalSize()}px`,
									position: "relative",
							  }
							: {}
					}
				>
					{items.length > 0 ? (
						items.map((item) => {
							const row = rowVirtualizer
								? rows[item.index]
								: (item as Row<T>);

							return (
								<TableRow
									className={`${
										rowVirtualizer ? "absolute" : ""
									} flex w-full`}
									key={
										keyField
											? row.getValue(keyField)
											: item.index
									}
									data-index={item.index}
									data-state={
										row.getIsSelected() && "selected"
									}
									ref={(node) =>
										rowVirtualizer
											? rowVirtualizer.measureElement(
													node
											  )
											: undefined
									}
									style={
										rowVirtualizer
											? {
													transform: `translateY(${
														(item as VirtualItem)
															.start
													}px)`,
											  }
											: {}
									}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<TableCell
												key={cell.id}
												className={`shrink-0 truncate ${
													cell.column.getSize() >
													minFixedWidth
														? "grow"
														: ""
												}`}
												width={cell.column.getSize()}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell
								colSpan={
									table
										.getAllColumns()
										.filter((column) => column.getCanHide())
										.length
								}
								className="text-center"
							>
								No results...
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{((hasNextPage && isFetching) || isLoading) && (
				<ReactSVG
					src={ICON_SRC["loading4"]}
					className="sticky animate-spin text-info w-8 left-1/2 bottom-10 m-2"
				/>
			)}
		</div>
	);
}
