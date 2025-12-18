import { ReactSVG } from "react-svg";
import { ICON_SRC } from "../../consts";
import { upperCase } from "lodash";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import type { Column, RowData } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

interface ITopContent<T> {
	fetched: number;
	rowsPerPage: string;
	rowsPerPageList: number[];
	setRowsPerPage: (rowsPerPage: string) => void;
	visibilityColumns: Column<T, unknown>[];
	refetch: () => void;
	isFetching: boolean;
	hasNextPage?: boolean;
	total?: number;
}

export function TopContent<T extends RowData>(props: ITopContent<T>) {
	const {
		fetched,
		rowsPerPage,
		rowsPerPageList,
		setRowsPerPage,
		visibilityColumns,
		refetch,
		isFetching,
		hasNextPage,
		total,
	} = props;

	return (
		<div className="flex justify-between items-center text-sm">
			<div className="hidden md:flex gap-2 items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="cursor-pointer">
						<Button variant="outline">
							<span>Columns&nbsp;</span>
							<ReactSVG src={ICON_SRC["chevron"]} className="w-4 opacity-50" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{visibilityColumns.map((column) => (
							<DropdownMenuCheckboxItem
								className="cursor-pointer"
								key={column.id}
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{typeof column.columnDef.header === "function"
									? upperCase(column.id)
									: column.columnDef.header}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<Select
					onValueChange={(v) => {
						setRowsPerPage(v);
					}}
					value={rowsPerPage}
				>
					<SelectTrigger className="cursor-pointer">
						<SelectValue placeholder="Rows per page" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel className="text-primary">Rows per page</SelectLabel>
							{rowsPerPageList.map((size) => (
								<SelectItem
									className="cursor-pointer"
									key={size}
									value={size.toString()}
								>
									{`${size}`}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				{!hasNextPage && !isFetching && (
					<Badge variant="destructive" className="text-nowrap">
						所有数据已获取
					</Badge>
				)}
			</div>
			<div className="flex items-center">
				<Button
					className="cursor-pointer rounded-full"
					disabled={isFetching}
					size="icon"
					variant="ghost"
					onClick={() => {
						refetch();
					}}
				>
					<ReactSVG
						src={ICON_SRC["processing"]}
						className={`text-purple-500 w-6 ${isFetching ? "animate-spin" : ""}`}
					/>
				</Button>
				<span className="text-nowrap">
					{`${fetched}${total ? `/${total}` : ""}`} rows fetched.
				</span>
			</div>
		</div>
	);
}
