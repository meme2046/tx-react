import type { Column, RowData } from "@tanstack/react-table";
import { DebouncedInput } from "../debounced-input.tsx";
import { Combobox } from "../combobox.tsx";

declare module "@tanstack/react-table" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: "text" | "select";
		selectItems?: { value: string; name: string }[];
	}
}
export const TableFilter = <TData, TValue>({
	column,
	className,
}: {
	column: Column<TData, TValue>;
	className?: string;
}) => {
	const { filterVariant, selectItems } = column.columnDef.meta ?? {};

	return filterVariant === "select" ? (
		<Combobox
			list={selectItems ?? []}
			onchange={(v) => column.setFilterValue(v)}
			width={column.getSize() > 160 ? 160 : column.getSize()}
		/>
	) : (
		<DebouncedInput
			className={`max-w-40 ${className}`}
			onChange={(value) => {
				column.setFilterValue(value);
			}}
			placeholder={`Search...`}
		/>
	);
};
