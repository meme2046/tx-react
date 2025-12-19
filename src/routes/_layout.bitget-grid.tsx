import { CoinItem, TxGridDetail, TxGridEnd } from "@/components/crypto";
import { ReactTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCsvInfinite } from "@/hooks/crypto";
import type { IGrid } from "@/types";
import { matchStr } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { reduce, round } from "lodash";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_layout/bitget-grid")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Bitget Grid",
			},
		],
	}),
});

function RouteComponent() {
	const columns = useMemo<ColumnDef<IGrid>[]>(
		() => [
			{
				accessorKey: "client_order_id",
				id: "id",
				header: "ID",
				size: 180,
			},
			{
				accessorKey: "open_at",
				id: "openAt",
				header: "开启时间",
				size: 160,
				cell: (cell) => <Badge>{matchStr(cell.getValue<string>())}</Badge>,
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) => `${row.symbol},${row.cex},${row.chain}`,
				id: "coin",
				header: "币种&交易平台",
				size: 144,
				cell: ({ row }) => {
					const orig = row.original;
					return (
						<CoinItem
							coin={orig.symbol.replace(/[_-]?usdt$/i, "").replace(/^1000/, "")}
							cex={orig.cex}
							dex={orig.chain}
						/>
					);
				},
				enableSorting: true,
			},
			{
				accessorFn: (row) => [row.cost, row.buy_px],
				id: "cost",
				header: "买入",
				size: 188,
				cell: (cell) => (
					<TxGridDetail data={cell.getValue<number[]>()} isBuy={true} />
				),
				enableColumnFilter: false,
				enableSorting: false,
			},
			{
				accessorFn: (row) => [row.benefit, row.sell_px],
				id: "benefit",
				header: "卖出",
				size: 188,
				cell: (cell) => (
					<TxGridDetail data={cell.getValue<number[]>()} isBuy={false} />
				),
				enableColumnFilter: false,
				enableSorting: false,
			},
			{
				accessorFn: (row) =>
					`${row.profit},${row.profit ? "complete" : "pending"}`,
				id: "profit",
				header: "结算",
				size: 120,
				cell: (cell) => <TxGridEnd data={cell.getValue<string>()} />,
				meta: {
					filterVariant: "select",
					selectItems: [
						{ value: "pending", name: "部分成交" },
						{ value: "complete", name: "全部成交" },
					],
				},
			},
			{
				accessorKey: "close_at",
				id: "closeAt",
				header: "结束时间",
				size: 160,
				cell: (cell) => {
					const closeAt = cell.getValue<string>();
					return (
						<>
							{closeAt ? (
								<Badge>{matchStr(closeAt)}</Badge>
							) : (
								<Skeleton className="w-32 h-5" />
							)}
						</>
					);
				},
				enableColumnFilter: false,
			},
		],
		[],
	);
	const initialVisibilityColumns = [
		"openAt",
		"coin",
		"cost",
		"benefit",
		"profit",
		"closeAt",
	];

	const rowsPerPageList: number[] = [30, 60, 120];
	const [rowsPerPage, setRowsPerPage] = useState<string>(
		`${rowsPerPageList[0]}`,
	);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		refetch,
		isFetchingNextPage,
		isFetching,
		isLoading,
	} = useCsvInfinite<IGrid>("github", "bitget");

	const sortedData = useMemo(() => {
		const flatData = data?.pages?.flatMap((page) => page.list) ?? [];
		return flatData.sort((a, b) => {
			return new Date(b.open_at).getTime() - new Date(a.open_at).getTime();
		});
	}, [data]);

	const pnl = useMemo(() => {
		return reduce(
			sortedData,
			(sum: number, v: IGrid) => {
				return sum + Number(v.profit);
			},
			0,
		);
	}, [sortedData]);

	return (
		<>
			<div className="relative mt-1">
				<Badge className="absolute right-0 md:right-44">
					<span className="text-lg">💰</span>
					<span className="text-base">{round(pnl, 2)}</span>
				</Badge>
			</div>

			<ReactTable
				data={sortedData}
				refetch={refetch}
				isFetching={isFetching}
				isLoading={isLoading}
				columns={columns}
				initialVisibilityColumns={initialVisibilityColumns}
				rowsPerPageList={rowsPerPageList}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				initialSorting={[{ id: "openAt", desc: true }]}
				subHeight={96}
				keyField="id"
				type="virtualized"
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				estimateRowHeight={86}
				overscan={2}
			/>
		</>
	);
}
